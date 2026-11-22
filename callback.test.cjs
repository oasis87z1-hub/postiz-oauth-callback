const { test } = require('node:test');
const assert = require('node:assert/strict');
const { localReturn } = require('./tiktok/callback.js');

test('returns a TikTok result only to the fixed local provider endpoint', () => {
  const url = new URL(localReturn('?code=synthetic%2Bcode&state=synthetic-state&redirect_uri=https%3A%2F%2Fevil.example&scopes=video.publish'));
  assert.equal(url.origin, 'http://localhost:4007');
  assert.equal(url.pathname, '/integrations/social/tiktok-business/');
  assert.equal(url.searchParams.get('code'), 'synthetic+code');
  assert.equal(url.searchParams.get('state'), 'synthetic-state');
  assert.equal(url.searchParams.get('scopes'), 'video.publish');
  assert.equal(url.searchParams.has('redirect_uri'), false);
});

test('keeps cancellation and rejects missing state, duplicates or mixed results', () => {
  assert.equal(new URL(localReturn('?error=access_denied&state=synthetic-state')).searchParams.get('error'), 'access_denied');
  assert.equal(localReturn(''), null);
  for (const search of ['?code=test', '?state=x', '?code=a&code=b&state=x', '?code=a&state=x&state=y', '?code=a&error=no&state=x', '?code=a&state=%00']) {
    assert.throws(() => localReturn(search));
  }
});
