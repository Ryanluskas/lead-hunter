import dns from 'dns/promises';
import { URL } from 'url';

/**
 * Validador e mitigador robusto de SSRF para auditoria de websites.
 * Impede que a ferramenta seja usada como proxy arbitrário ou acesse recursos internos.
 */

// Verifica se um IP v4 é privado, reservado ou de loopback
function isPrivateIPv4(ip: string): boolean {
  const parts = ip.split('.').map((p) => parseInt(p, 10));
  if (parts.length !== 4 || parts.some((p) => isNaN(p) || p < 0 || p > 255)) {
    return true; // Inválido = bloqueado por segurança
  }

  const [p0, p1] = parts;

  // 127.0.0.0/8 (Loopback)
  if (p0 === 127) return true;
  // 10.0.0.0/8 (Privado Classe A)
  if (p0 === 10) return true;
  // 172.16.0.0/12 (Privado Classe B)
  if (p0 === 172 && p1 >= 16 && p1 <= 31) return true;
  // 192.168.0.0/16 (Privado Classe C)
  if (p0 === 192 && p1 === 168) return true;
  // 169.254.0.0/16 (Link-Local e AWS/GCP/Azure Cloud Metadata 169.254.169.254)
  if (p0 === 169 && p1 === 254) return true;
  // 0.0.0.0/8 (Current network)
  if (p0 === 0) return true;
  // 100.64.0.0/10 (Carrier-grade NAT)
  if (p0 === 100 && p1 >= 64 && p1 <= 127) return true;
  // 224.0.0.0/4 (Multicast)
  if (p0 >= 224) return true;

  return false;
}

// Verifica se um IP v6 é privado, local ou especial
function isPrivateIPv6(ip: string): boolean {
  const normalized = ip.toLowerCase();
  if (normalized === '::1' || normalized === '::') return true;
  if (normalized.startsWith('fc') || normalized.startsWith('fd')) return true; // Unique local address (fc00::/7)
  if (normalized.startsWith('fe80:')) return true; // Link-local
  if (normalized.startsWith('::ffff:')) {
    const v4part = normalized.replace('::ffff:', '');
    return isPrivateIPv4(v4part);
  }
  return false;
}

export interface UrlValidationResult {
  isValid: boolean;
  sanitizedUrl?: string;
  error?: string;
}

export async function validateSafeUrl(rawUrl: string): Promise<UrlValidationResult> {
  if (!rawUrl || typeof rawUrl !== 'string') {
    return { isValid: false, error: 'URL não informada ou formato inválido.' };
  }

  let formatted = rawUrl.trim();
  if (!formatted.startsWith('http://') && !formatted.startsWith('https://')) {
    formatted = `https://${formatted}`;
  }

  let parsed: URL;
  try {
    parsed = new URL(formatted);
  } catch {
    return { isValid: false, error: 'URL malformada.' };
  }

  // 1. Validar protocolo permitido
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return { isValid: false, error: `Protocolo "${parsed.protocol}" não permitido. Use HTTP ou HTTPS.` };
  }

  // 2. Validar porta
  if (parsed.port && parsed.port !== '80' && parsed.port !== '443') {
    return { isValid: false, error: `Porta não padrão "${parsed.port}" bloqueada por segurança.` };
  }

  const hostname = parsed.hostname.toLowerCase();

  // 3. Bloqueio de hostnames locais óbvios
  const blockedHostnames = ['localhost', 'local', 'internal', 'lan', 'intranet', 'home'];
  if (
    blockedHostnames.includes(hostname) ||
    hostname.endsWith('.localhost') ||
    hostname.endsWith('.local') ||
    hostname.endsWith('.internal')
  ) {
    return { isValid: false, error: 'Endereços locais ou internos não são permitidos para auditoria.' };
  }

  // 4. Resolução DNS e inspeção de IP
  try {
    const lookupResult = await dns.lookup(hostname, { all: true });
    if (!lookupResult || lookupResult.length === 0) {
      return { isValid: false, error: `Não foi possível resolver o domínio "${hostname}".` };
    }

    for (const record of lookupResult) {
      const { address, family } = record;
      if (family === 4 && isPrivateIPv4(address)) {
        return {
          isValid: false,
          error: `O domínio resolve para o IP privado/local ${address}, bloqueado contra SSRF.`,
        };
      }
      if (family === 6 && isPrivateIPv6(address)) {
        return {
          isValid: false,
          error: `O domínio resolve para o IPv6 local/privado ${address}, bloqueado contra SSRF.`,
        };
      }
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Falha na resolução DNS';
    return { isValid: false, error: `Erro ao verificar o domínio: ${message}` };
  }

  return { isValid: true, sanitizedUrl: parsed.toString() };
}

export interface SafeFetchOptions {
  timeoutMs?: number;
  maxSizeBytes?: number;
  maxRedirects?: number;
}

export interface SafeFetchResponse {
  url: string;
  finalUrl: string;
  status: number;
  headers: Record<string, string>;
  bodyText: string;
  loadTimeMs: number;
}

export async function safeFetchWebsite(
  initialUrl: string,
  options: SafeFetchOptions = {}
): Promise<SafeFetchResponse> {
  const timeoutMs = options.timeoutMs ?? 8000;
  const maxSizeBytes = options.maxSizeBytes ?? 2 * 1024 * 1024; // 2MB
  const maxRedirects = options.maxRedirects ?? 3;

  let currentUrl = initialUrl;
  let redirectsCount = 0;

  const startTime = Date.now();

  while (redirectsCount <= maxRedirects) {
    // Validação estrita do URL antes de cada chamada (incluindo redirects)
    const check = await validateSafeUrl(currentUrl);
    if (!check.isValid || !check.sanitizedUrl) {
      throw new Error(check.error || 'URL bloqueada pela política de segurança SSRF.');
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(check.sanitizedUrl, {
        method: 'GET',
        redirect: 'manual', // Tratar redirects manualmente para revalidar SSRF
        signal: controller.signal,
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 LeadHunterAuditor/1.0',
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
        },
      });

      clearTimeout(timer);

      // Tratamento de redirecionamento
      if ([301, 302, 303, 307, 308].includes(response.status)) {
        const location = response.headers.get('location');
        if (!location) {
          throw new Error(`Redirecionamento ${response.status} sem cabeçalho Location.`);
        }
        redirectsCount++;
        if (redirectsCount > maxRedirects) {
          throw new Error('Limite máximo de redirecionamentos atingido.');
        }

        // Resolver redirect relativo ou absoluto
        currentUrl = new URL(location, check.sanitizedUrl).toString();
        continue;
      }

      // Leitura com limitação de tamanho para evitar DoS / memory exhaustion
      const contentLengthHeader = response.headers.get('content-length');
      if (contentLengthHeader && parseInt(contentLengthHeader, 10) > maxSizeBytes) {
        throw new Error('O conteúdo da página excede o tamanho máximo permitido (2MB).');
      }

      const reader = response.body?.getReader();
      let bodyText = '';
      let receivedBytes = 0;

      if (reader) {
        const decoder = new TextDecoder('utf-8');
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          receivedBytes += value.length;
          if (receivedBytes > maxSizeBytes) {
            reader.cancel();
            throw new Error('Página interrompida por exceder o tamanho máximo de download.');
          }
          bodyText += decoder.decode(value, { stream: true });
        }
      }

      const loadTimeMs = Date.now() - startTime;
      const headersMap: Record<string, string> = {};
      response.headers.forEach((val, key) => {
        headersMap[key] = val;
      });

      return {
        url: initialUrl,
        finalUrl: check.sanitizedUrl,
        status: response.status,
        headers: headersMap,
        bodyText,
        loadTimeMs,
      };
    } catch (err: unknown) {
      clearTimeout(timer);
      if (err instanceof Error && err.name === 'AbortError') {
        throw new Error(`Tempo limite de requisição excedido (${timeoutMs / 1000}s).`);
      }
      throw err;
    }
  }

  throw new Error('Muitos redirecionamentos encontrados.');
}
