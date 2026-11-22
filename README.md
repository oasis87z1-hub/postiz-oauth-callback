# Content-Zentrale: TikTok callback

Static HTTPS callback for the owner's local Postiz installation. It forwards only the TikTok authorization result to the fixed destination `http://localhost:4007/integrations/social/tiktok-business/`. It cannot accept a custom redirect destination.

There are no credentials, analytics, API requests, persistent browser storage, backend token exchanges or third-party scripts in this repository. The short-lived OAuth result reaches the hosting provider as part of the normal HTTPS request. Client secrets and durable access tokens stay in local Postiz.

The landing page removes the query from browser history, suppresses referrers, forwards only allowlisted parameters and rejects duplicate or incomplete results. Postiz must validate its OAuth state and exchange the code using the matching registered HTTPS redirect URI.

This callback is not a publisher or media host. TikTok app/Accounts API review and individual account authorization are separate requirements. Postiz must run on this same Mac for the local return to work.

Validation: `node --test callback.test.cjs` (two passing checks). Published with HTTPS on 2026-11-22: `https://oasis87z1-hub.github.io/postiz-oauth-callback/tiktok/`.
