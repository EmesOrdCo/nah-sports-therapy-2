import test from 'node:test';
import assert from 'node:assert/strict';
import endpoint from '../api/enquiry.js';

process.env.RESEND_API_KEY = 'migration-fixture-only';
process.env.MAIL_FROM = 'website@example.com';
process.env.MAIL_TO = 'migration@example.com';

function request(values = {}) {
  const form = new FormData();
  for (const [key, value] of Object.entries({ name: 'Migration <test>', email: 'fixture@example.com', message: 'A test enquiry', consent: 'yes', ...values })) form.set(key, value);
  return new Request('https://www.njhsportstherapy.co.uk/api/enquiry', { method: 'POST', body: form });
}

test('enquiry sends the same notification and returns success only after the provider accepts it', async () => {
  const original = globalThis.fetch;
  let sent;
  globalThis.fetch = async (url, options) => {
    assert.equal(url, 'https://api.resend.com/emails');
    sent = JSON.parse(options.body);
    return new Response('{"id":"fixture"}', { status: 200 });
  };
  try {
    const response = await endpoint.fetch(request());
    assert.equal(response.status, 200);
    assert.equal((await response.json()).success, true);
    assert.deepEqual(sent.to, ['migration@example.com']);
    assert.match(sent.html, /Migration &lt;test&gt;/);
    assert.match(sent.reply_to, /fixture@example.com/);
  } finally { globalThis.fetch = original; }
});

test('honeypot does not send mail, and invalid forms remain rejected', async () => {
  const original = globalThis.fetch;
  globalThis.fetch = async () => { throw new Error('No outgoing request should happen'); };
  try {
    const honeypot = await endpoint.fetch(request({ _gotcha: 'bot' }));
    assert.equal((await honeypot.json()).success, true);
    const invalid = await endpoint.fetch(request({ email: 'invalid' }));
    assert.equal(invalid.status, 400);
    assert.equal((await invalid.json()).success, 'false');
  } finally { globalThis.fetch = original; }
});

test('mail provider rejection is visible to the enquirer', async () => {
  const original = globalThis.fetch;
  globalThis.fetch = async () => new Response('fixture rejection', { status: 503 });
  try {
    const response = await endpoint.fetch(request());
    assert.equal(response.status, 502);
    assert.equal((await response.json()).success, 'false');
  } finally { globalThis.fetch = original; }
});
