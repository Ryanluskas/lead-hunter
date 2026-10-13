const test = require('node:test');
const assert = require('node:assert');

// Testes diretos da lógica de mitigação de SSRF
function isPrivateIPv4(ip) {
  const parts = ip.split('.').map((p) => parseInt(p, 10));
  if (parts.length !== 4 || parts.some((p) => isNaN(p) || p < 0 || p > 255)) {
    return true;
  }
  const [p0, p1] = parts;
  if (p0 === 127) return true; // Loopback
  if (p0 === 10) return true;  // Private 10.0.0.0/8
  if (p0 === 172 && p1 >= 16 && p1 <= 31) return true; // Private 172.16.0.0/12
  if (p0 === 192 && p1 === 168) return true; // Private 192.168.0.0/16
  if (p0 === 169 && p1 === 254) return true; // Cloud Metadata 169.254.169.254
  if (p0 === 0) return true;
  if (p0 === 100 && p1 >= 64 && p1 <= 127) return true;
  if (p0 >= 224) return true;
  return false;
}

test('SSRF Guard: Deve bloquear 127.0.0.1 (Loopback)', () => {
  assert.strictEqual(isPrivateIPv4('127.0.0.1'), true);
});

test('SSRF Guard: Deve bloquear 169.254.169.254 (Cloud Metadata Service)', () => {
  assert.strictEqual(isPrivateIPv4('169.254.169.254'), true);
});

test('SSRF Guard: Deve bloquear faixas de rede privada RFC 1918', () => {
  assert.strictEqual(isPrivateIPv4('10.0.1.50'), true);
  assert.strictEqual(isPrivateIPv4('192.168.1.1'), true);
  assert.strictEqual(isPrivateIPv4('172.20.10.1'), true);
});

test('SSRF Guard: Deve permitir IPs públicos legítimos', () => {
  assert.strictEqual(isPrivateIPv4('8.8.8.8'), false);
  assert.strictEqual(isPrivateIPv4('142.250.190.46'), false);
  assert.strictEqual(isPrivateIPv4('1.1.1.1'), false);
});
