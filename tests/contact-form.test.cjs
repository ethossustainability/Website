const assert = require('node:assert/strict');
const { test } = require('node:test');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');
const script = fs.readFileSync(path.join(__dirname, '../script.js'), 'utf8');
const handlerSource = script.slice(script.indexOf('// Contact Form AJAX Submission'), script.indexOf('// Add scroll effect to navbar'));

function setup(fetchResponse = async () => ({ ok: true, json: async () => ({ success: true }) })) {
    let handler;
    const result = { style: {}, textContent: '', className: '' };
    const button = { style: {}, disabled: false, textContent: 'Submit' };
    const honeypot = { value: 'on', checked: false };
    const requests = [];
    const timers = new Map();
    const form = {
        valid: true, resets: 0, reports: 0, attributes: {},
        addEventListener: (_, callback) => { handler = callback; },
        checkValidity() { return this.valid; },
        reportValidity() { this.reports++; },
        querySelector: () => honeypot,
        setAttribute(key, value) { this.attributes[key] = value; },
        reset() { this.resets++; }
    };
    vm.runInNewContext(handlerSource, {
        document: { getElementById: id => ({ contactForm: form, 'contact-result': result, 'submit-btn': button })[id] },
        FormData: class { *[Symbol.iterator]() { yield ['name', 'Test']; yield ['email', 'test@example.invalid']; yield ['message', 'Local fixture only']; } },
        AbortController,
        setTimeout(callback, delay) { timers.set(delay, callback); return delay; },
        clearTimeout(id) { timers.delete(id); },
        fetch: async (url, options) => { requests.push({ url, options }); return fetchResponse(url, options); }
    });
    return { form, result, button, honeypot, requests, timers, submit: () => handler({ preventDefault() {} }) };
}

test('an unchecked bot checkbox does not block a valid message', async () => {
    const fixture = setup();
    await fixture.submit();
    assert.equal(fixture.requests.length, 1);
    assert.equal(fixture.form.resets, 1);
    assert.match(fixture.result.textContent, /sent successfully/);
    assert.equal(fixture.button.disabled, false);
    assert.notEqual(fixture.button.style.display, 'none');
    assert.equal(fixture.form.attributes['aria-busy'], 'false');
    assert.equal(fixture.timers.size, 0);
});
test('invalid fields and checked bot traps never reach the service', async () => {
    const invalid = setup(); invalid.form.valid = false;
    await invalid.submit();
    assert.equal(invalid.requests.length, 0);
    assert.equal(invalid.form.reports, 1);
    const bot = setup(); bot.honeypot.checked = true;
    await bot.submit();
    assert.equal(bot.requests.length, 0);
    assert.match(bot.result.textContent, /blocked/);
});
test('HTTP 200 without service acceptance retains the message for retry', async () => {
    const fixture = setup(async () => ({ ok: true, json: async () => ({ success: false }) }));
    await fixture.submit();
    assert.equal(fixture.form.resets, 0);
    assert.match(fixture.result.textContent, /try again/);
    assert.equal(fixture.button.disabled, false);
});
test('HTTP failure cannot be mistaken for successful delivery', async () => {
    const fixture = setup(async () => ({ ok: false, json: async () => ({ success: true }) }));
    await fixture.submit();
    assert.equal(fixture.form.resets, 0);
    assert.match(fixture.result.textContent, /couldn’t send/);
});
test('network errors and invalid service replies allow retry', async () => {
    for (const response of [async () => { throw new Error('Offline'); }, async () => ({ ok: true, json: async () => { throw new Error('Not JSON'); } })]) {
        const fixture = setup(response);
        await fixture.submit();
        assert.equal(fixture.form.resets, 0);
        assert.equal(fixture.button.disabled, false);
        assert.match(fixture.result.textContent, /info@ethossustainability.org/);
    }
});
test('a slow request times out with the message preserved', async () => {
    const fixture = setup((_, options) => new Promise((resolve, reject) => {
        options.signal.addEventListener('abort', () => { const error = new Error('Timeout'); error.name = 'AbortError'; reject(error); });
    }));
    const pending = fixture.submit();
    assert.equal(fixture.button.disabled, true);
    fixture.timers.get(15000)();
    await pending;
    assert.equal(fixture.form.resets, 0);
    assert.match(fixture.result.textContent, /took too long/);
    assert.equal(fixture.button.disabled, false);
});
test('repeated clicks cannot send a duplicate while a request is pending', async () => {
    let complete;
    const fixture = setup(() => new Promise(resolve => { complete = resolve; }));
    const pending = fixture.submit();
    await fixture.submit();
    assert.equal(fixture.requests.length, 1);
    complete({ ok: true, json: async () => ({ success: true }) });
    await pending;
});
