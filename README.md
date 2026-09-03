# Terrible Gmail Clone — Terminal Edition

A working Gmail-style inbox, skinned as a retro hacker/CTF terminal, where
every interaction deliberately breaks a real usability principle. Open
`index.html` in any browser — no server, no install, no build step
required. (The pixel fonts load from Google Fonts, so an internet
connection makes the theme look right; without one it just falls back
to a plain monospace font — everything still works either way.)

## Anti-patterns and what each one violates

1. **Read/unread flips randomly on hover** — violates *visibility of
   system status*. You can never trust what the interface is telling you.
2. **Reply opens a new blank tab** — breaks user flow / *minimize the
   user's memory load*.
3. **Delete requires 5 sequential confirmations**, silent on cancel —
   *error prevention* taken to self-defeating extremes.
4. **"Unsubscribe" and "Delete Forever" swap position every 2.5s** —
   violates *recognition over recall* and Fitts's Law.
5. **Neither button does what it says** — clicking Unsubscribe claims
   "deleted", clicking Delete Forever claims "unsubscribed". The system
   actively lies about what happened (*visibility of system status*,
   inverted on purpose).
6. **Sidebar nav order shuffles on every reload** — violates
   *consistency and standards*.
7. **Clicking a sidebar item highlights a random OTHER item as active**
   — violates *visibility of system status*; you can't trust what
   section you're supposedly in.
8. **"Starred" is a dead end behind a fake paywall** — broken promise,
   violates *user control and freedom*.
9. **"Sent" doesn't show sent mail — it opens Compose** — violates
   *match between system and the real world*; the label lies about
   its function.
10. **"Drafts" silently deletes a random email, zero confirmation** —
    the inverse problem of the 5-confirmation Delete button; violates
    *error prevention*.
11. **"Trash" restores every deleted email at once, no warning** —
    violates the user's basic mental model that deleted means gone.
12. **Fake "Logout" that refuses to log out** — violates *match between
    system and the real world*.
13. **Search matches the reversed query string** — the system's model
    of "search" has nothing to do with the user's.
14. **Scrolling scrambles font size and color** — violates *aesthetic
    and minimalist design* and basic legibility.
15. **Compose auto-sends 5 seconds after you stop typing, no undo** —
    the opposite of *user control and freedom*.
16. **The Send button moves away from the cursor** — textbook Fitts's
    Law violation.
17. **"Attach file" downloads an unrelated file instead of opening a
    picker** — the button's label lies about what it does.
18. **A fullscreen popup ad interrupts you every 30 seconds**, with a
    close button that relocates to a random corner each time and
    blocks all other interaction until you click it — violates *user
    control and freedom* by constantly hijacking focus.

## Files

- `index.html` — page structure, plus fake OS title bar / browser
  chrome / scrolling footer ticker for the terminal theme
- `style.css` — full dark/neon-green/yellow terminal styling
- `script.js` — all interactive behavior, each anti-pattern numbered
  and commented inline to match the list above

## How to run

Double-click `index.html`, or open it in any browser. No dependencies,
no npm install, no server needed.
