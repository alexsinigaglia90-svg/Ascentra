# Ascentra Site Scaffold

Premium multi-page static site (vanilla HTML/CSS/JS) with:
- marketing pages,
- a demo client portal,
- Cloudflare Pages Functions API stubs,
- and an interactive Platform Experience (embedded on home + standalone `platform.html`).

## Structure

- `index.html` plus service pages (`ascentra-*.html`, `our-work.html`, `contact.html`, `client-login.html`).
- `platform.html` standalone Platform Experience page.
- `css/styles.css` shared visual system and responsive layout.
- `js/main.js` shared navigation, language/theme/palette controls.
- `js/platform-experience.js` in-page app-shell tour with History API routing.
- `js/portal.js` demo login/session/ticket client logic.
- `functions/api/*` demo cookie session + ticket endpoints.

## Hero media

Replace `assets/video/hero.mp4` with your production hero video.
