# Cesar Araujo — Hair Artistry

A single-page luxury landing site for Cesar Araujo, hair stylist & colourist
(Vaffi Salon, Toronto). Plain static **HTML / CSS / JS** — no build step,
no dependencies.

Implemented from the [Claude Design](https://claude.ai/design) project
*"Cesar Araujo luxury brand"* (`Cesar Araujo.dc.html`), converted from the
Claude Design runtime format to a standalone static site.

## Structure

```
index.html    Markup (sections styled inline, as in the source design)
styles.css    Base styles, image-placeholder visuals, responsive layer
script.js     Nav scroll state, reveal-on-scroll, hero parallax,
              hover effects, and the booking form
assets/       Photography (see assets/README.md) — placeholders until added
```

## Run locally

It's static — open `index.html` directly, or serve the folder:

```bash
python3 -m http.server 4178
# then visit http://localhost:4178
```

## Photography

Cesar's portraits are in place (hero, about, and the signature feature). The
gallery tiles still show a gold **CA** monogram placeholder — they're for
client hair work. Drop files into `assets/` using the names in
[`assets/README.md`](assets/README.md) and they appear automatically.

## Notes

- **Sections:** hero · marquee · about · colour menu (services) · gallery ·
  testimonials · contact/booking · footer.
- **Booking form** is front-end only (it confirms visually but does not send).
  Wire the submit handler in `script.js` to email / Calendly / WhatsApp to
  make it live.
- **Fonts:** Cormorant Garamond + Jost (Google Fonts).
- **Responsive** down to mobile; respects `prefers-reduced-motion`.
