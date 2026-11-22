(function (root) {
  'use strict';
  const target = 'http://localhost:4007/integrations/social/tiktok-business/';
  const allowed = ['code', 'auth_code', 'state', 'scopes', 'error', 'error_description', 'error_code'];

  function localReturn(search) {
    if (typeof search !== 'string' || search.length > 16384) throw new Error('Invalid callback');
    const incoming = new URLSearchParams(search);
    if (!Array.from(incoming.keys()).length) return null;
    for (const key of allowed) {
      if (incoming.getAll(key).length > 1) throw new Error('Duplicate callback parameter');
    }
    const state = incoming.get('state');
    const code = incoming.get('code') || incoming.get('auth_code');
    const error = incoming.get('error');
    if (!state || state.length > 512 || /[\u0000-\u001f\u007f]/.test(state)) throw new Error('Missing or invalid state');
    if ((!code && !error) || (code && error)) throw new Error('Invalid callback result');
    const destination = new URL(target);
    for (const key of allowed) {
      if (incoming.has(key)) destination.searchParams.set(key, incoming.get(key));
    }
    return destination.href;
  }

  if (typeof module !== 'undefined' && module.exports) module.exports = { localReturn };
  if (!root || !root.document) return;
  const search = root.location.search;
  // Remove the short-lived authorization result from browser history before leaving.
  root.history.replaceState(null, '', root.location.pathname);
  try {
    const destination = localReturn(search);
    if (!destination) return;
    root.document.getElementById('status').textContent = 'Anmeldung empfangen. Zurück zu deinem lokalen Postiz …';
    const link = root.document.getElementById('continue');
    link.href = destination;
    link.hidden = false;
    root.location.replace(destination);
  } catch (_) {
    root.document.getElementById('status').textContent = 'Diese Rückleitung ist unvollständig. Bitte starte die TikTok-Verknüpfung erneut in Postiz.';
  }
})(typeof window === 'undefined' ? null : window);
