# Ethos Sustainability website

A static HTML, CSS, and JavaScript site. No build step or package installation is required.

## Local preview

From this directory, run:

```sh
python -m http.server 4174 --bind 127.0.0.1
```

Open http://127.0.0.1:4174 in a browser.

## Sustainability refresh

- Shared logo-matched burgundy, terracotta, apricot, coral, and rose colors with warm ivory backgrounds, including the Team page.
- Homepage hero with existing Ethos conference photography, an animated values strip, and floating planet artwork.
- A skippable seed-to-sprout welcome appears once per tab session, fades after the page loads, and has a 2.4-second fallback. Reduced-motion users skip it entirely.
- Staggered scroll reveals, gentle header movement, responsive card interactions, and form focus effects are shared across the site's sections.
- STEM, Business, Partners, and Team have distinct editorial openings, existing community photography or animated artwork, and clear routes into their content. Partners includes a featured Kumon partnership; Team uses named portrait cards with keyboard-accessible biographies.
- Scroll reveals and a pointer-following glow on desktop. The native cursor remains visible.
- The recycle symbol in each footer opens an eight-item sorting game with explanations, scoring, and replay. It supports clicks, touch, keyboard navigation, and Escape to close.
- Footer motion controls pause animation and the quote carousel. The site respects the operating system's reduced-motion setting; the cursor glow is disabled on mobile.

The game uses no tracking, cookies, or persistent score storage. Its sorting examples are educational; local recycling and composting rules vary. Session storage remembers the welcome and motion pause preference for this tab only.

Referenced photographs use WebP copies capped at 1600 pixels with the source images preserved. The 58 copies total 10.5 MB versus 50.7 MB for the originals.

Run `node --test tests/contact-form.test.cjs` to check the contact submission handler with mocked service responses. These tests never send a message. Validation, the bot trap, service acceptance, failures, timeout, and duplicate-submit protection are covered; actual inbox delivery still requires a real submission.

Browser checks covered desktop and 390px mobile layouts, mobile navigation, cursor movement, correct and incorrect answers, scoring, results, replay, Escape dismissal, and motion pause. JavaScript syntax and `git diff --check` also passed. The refresh has not been published to the live website.
