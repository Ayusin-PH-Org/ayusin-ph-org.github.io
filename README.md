# Marketing Site

Static, single‑page marketing site for the Unified Civic Engagement Platform for the Philippines.

## Quick Start
- Open `index.html` directly in a browser, or serve locally:
  - Python: `python3 -m http.server -d marketing-site 8080`
  - Node (if installed): `npx http-server marketing-site -p 8080`

## Customize Branding
- Edit the brand name once in `assets/script.js` (`BRAND_NAME`) to update all references.
- Update the email in the Contact section (`index.html`, `mailto:` link).
- Page title and description are in the `<head>` of `index.html`.

## Images & Logos
- Replace thumbnails in the Updates band by swapping files under `assets/img/thumb1.svg`, `thumb2.svg`, `thumb3.svg` or point the `<img class="thumb">` `src` to your own images.
- Replace partner logos in the logos strip by dropping SVG/PNG files in `assets/img/` and updating the `<img>` tags inside the `partners-band` section.
- The yellow brush edge at the top of the Features band is `assets/img/brush-top.svg` — replace with your own brush texture if desired.

## Content Sections
- Executive Summary, Vision & Goals, Scope, How It Works, Roadmap, Tech Stack, Timeline, Risks, Metrics, and Contact.
- All content is based on the provided product brief; adjust copy as the project evolves.

## Notes
- No external dependencies; CSS/JS are local for portability.
- Colors reflect the Philippine flag (blue/red/yellow) with accessible contrast.
- Replace or extend sections to fit new phases or announcements.
