# Core Vocabulary

A spelling game for two, with a mode for one, hosted by Wormsworth, a worm in glasses who lives in an apple.

Wormsworth says a word. One player spells it out loud. The other types exactly what they hear and presses Enter. Right answers bring harder words, and a few misses ease things up.

**Play it:** https://jacksonmeehan.github.io/spelling-bee/ (once GitHub Pages is switched on for this repo)

## What is in the game

- 800 American English words on eight levels, 100 per level, from *garden* to *scherenschnitte*
- Clues on request: definition, part of speech, use in a sentence, and origin
- Optional time limit per word, off by default
- No word repeats within a game until the whole bank has been used
- Two spellers taking turns, each with their own level, or one speller with a typist
- A one-player mode: listen, type the word yourself, or give up to see it at the cost of a miss
- Sound effects, a session report, and a list of missed words to revisit

## Files

| Path | What it is |
| --- | --- |
| `index.html` | The whole game: one built page. This is what GitHub Pages serves. Do not edit it by hand. |
| `src/index.src.html` | The page source: markup, styles and game code, without the word bank. |
| `data/level1.txt` to `data/level8.txt` | The word bank, one word per line. |
| `tools/build.js` | Checks the word bank and writes `index.html`. |
| `manifest.webmanifest`, `icons/` | Lets phones and laptops install the site as an app. |
| `.nojekyll` | Tells GitHub Pages to serve the files as they are. |

## Changing the game

Edit `src/index.src.html` or the files in `data/`, then rebuild:

```sh
node tools/build.js
```

The build needs only Node.js, with no packages to install. It prints any problem it finds in the word bank and exits with an error if there is one. Commit `index.html` along with your changes, because the site serves that file directly.

### Word bank format

Each line holds one word, with fields separated by `|`:

```
word|part of speech|origin|definition|sentence|pronunciation guide
```

- **Part of speech:** `n`, `v`, `adj` or `adv`.
- **Origin:** source languages from oldest to newest, separated by `>`, such as `Greek>Latin>French`. The first language decides the country shown in the game, so it must appear in the `HOMELANDS` table in `src/index.src.html`.
- **Definition:** must not contain the word itself.
- **Sentence:** must contain the word exactly as spelled, so the game can blank it out on screen.
- **Pronunciation guide:** required on levels 5 to 8, left off on levels 1 to 4. It is shown only to the typist.

## Publishing

In the repository settings, under Pages, choose **Deploy from a branch**, branch `main`, folder `/ (root)`. Each push to `main` republishes the site within a few minutes.

## Known limits

- Pronunciation uses the browser's built-in voice, so clarity varies by device and rare words can be mispronounced. Pre-recorded audio is the planned fix.
- One-player mode depends entirely on that voice. If a word is garbled, the definition and sentence clues are the only help short of giving up. Words that sound alike, such as *colonel* and *kernel*, need the definition to tell apart.
- Definitions, sentences and origins were written by hand and have not been checked against a dictionary. Corrections are welcome.
