# HyperSecure Key Generator — a classroom demo

> ⚠️ **This is a deliberately broken key generator for teaching. Never use its keys for anything real.**

The site claims to be "the world's most secure key generator": quantum-hardened,
military-grade, zero-knowledge, open source, with an entropy meter and a green
"UNBREAKABLE ✅" rating. Its output looks random and would pass statistical
randomness tests.

It can still only ever produce **4,096 different keys**, and anyone who reads
the ~100 lines in [`js/keygen.js`](js/keygen.js) can list all of them.

**The lesson:** marketing, badges, "open source" and output that looks random
tell you nothing. You have to read the code, or trust someone who did.

## What's wrong with it (spoilers for students)

Open [`js/keygen.js`](js/keygen.js) and look for these:

| Claim on the website | What the code does |
| --- | --- |
| "True human entropy from your mouse & keyboard" | `addEntropy()` stores the events, but nothing ever reads them. The entropy bar is decoration. |
| 256-bit / 512-bit keys, "≈ 10^77 possible keys" | `ENTROPY_POOL_SIZE = 4096`. The only random input is a choice of 1 out of 4096 slots, which is 12 bits of real entropy whatever key size you pick. |
| "Running 1,000,000 hardening rounds" | `HARDENING_ROUNDS = 1`, so the hardening loop never runs. The progress list in `ui.js` is a timed animation. |
| "Military-grade SHA-256" | SHA-256 is fine, but it is applied to a public salt plus a slot number. Hashing a guessable input gives a guessable output that only *looks* random. |
| "Cryptographically secure" | The slot is picked with `Math.random()`, which is not a cryptographic RNG. That doesn't matter much here because there are only 4096 slots anyway. |
| "Open source, so you know it's safe" | Being open source only helps if someone actually reads the code. |

A correct generator just calls `crypto.getRandomValues(new Uint8Array(32))`.

## Running the lesson

1. Show the main page. Let students move the mouse to fill the entropy bar and generate keys. Ask: *would you use this?*
2. Have a student generate a key and paste it into the chat or onto the board.
3. Open **`crack.html`** (not linked from the main page) and paste the key. It is found instantly, with its slot number.
   You can also run `python3 tools/crack.py <key>` or `python3 tools/crack.py --list`.
4. Open `js/keygen.js` together and find the flaws in the table above.

Bonus: generate 100 keys on the site. By the birthday paradox, the chance that
two of them are identical is about 70%.

## Files

- `index.html`, `style.css`, `js/ui.js`: the convincing front end
- `js/keygen.js`: the "engine", where the flaws are
- `crack.html`: the attacker's page, which precomputes all 36,864 outputs (4096 slots × 3 sizes × 3 formats)
- `tools/crack.py`: the same attack from the command line

There is no build step. It is plain static files served by GitHub Pages from the `main` branch root.
