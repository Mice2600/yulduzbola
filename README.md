# YulduzBola: the website

The advertising site for YulduzBola, a chore game for families on Android (ages 3–14).
One page in three languages (Uzbek by default, Russian, English). The page is a small game itself:
visitors catch stars, sweep dust off a picture, open badges and spend their stars in a reward shop.
It also has the real app running inside a phone frame, a star calculator that uses the app's own
approval rules, an age slider over the app's real task list, and the presentation as PDF.

Live: https://mice2600.github.io/yulduzbola/

## Run it

Needs Node 22 or newer and Python 3 with Pillow. Chrome must be installed (used headless).

```
npm install
npm run build      # writes dist/
npm run serve      # http://localhost:4173/yulduzbola/
```

## Change things

| What | Where |
|---|---|
| Contact details (email, phone, Telegram) | `src/site.mjs`, `contact`. Empty fields are hidden; with all three empty the contact block is not shown. |
| Android download button | `src/site.mjs`, `apkUrl`. Empty means no button. |
| Any sentence on the site or in the slides | `src/i18n.mjs`. The three languages have the same keys. |
| Tasks, badges, ranks, reward prices | `src/data/app.mjs`. Copied from the app's `lib/data.dart`; names come from `src/data/app-i18n.json` (the app's own translation file). |
| Page layout | `src/page.mjs`, `src/style.css`, `src/app.js` |
| Slides | `src/deck.mjs`, `src/deck.css` |
| Address of the site | `src/site.mjs`, `url` and `base`. The demo must then be rebuilt with the same base path (see below). |

Every number on the site comes from the app's code. Keep it that way.
The "Works today / In testing / Not yet" block is the honest status of the project; update it when the status changes.

## Pictures

- `public/img/hero.jpg`, `girl.jpg`, `teen.jpg`, `father.jpg`, `night.jpg`: made with an AI image model
  (the footer of the site says so). The full-size originals are in `exports/pictures/`.
- `public/img/app/*.webp`: real screens of the app, captured from the demo build at phone size with
  `node tools/appshots.mjs scratch/app <lang>` (serve `public/` first: `node tools/serve.mjs public`).
- `public/img/tasks/*.webp`: the app's own task illustrations.
- `python -I tools/images.py` turns `scratch/gen` and `scratch/app` into `public/img`.

## The live demo

`public/demo/` is the app itself, built for the browser from a copy of the Flutter project
(`flutter build web --release --base-href /yulduzbola/demo/`, then the `canvaskit` folder removed
because it loads from Google's CDN). The copy differs from the Android project in a few lines:

- a first visit starts with a sample family (Aziz, Malika, Jasur), so there is something to play with;
- photos are picked as files, because a browser has no app storage;
- the activity list shows the task's name instead of its internal key;
- bonus stars are counted once (the Android build adds them twice when a parent approves).

The last two are bugs in the app that are worth fixing there too.

## PDFs and exports

```
npm run build
npm run serve          # leave it running, and in a second terminal:
npm run pdf            # prints the slides and fills exports/
npm run build          # again, so the new PDFs are in dist/
```

`exports/` (not in git) then holds, per language: the full PDF, a light PDF under 5 MB with a clickable
link on every page, one JPG per slide (`exports/<lang>/slide-01.jpg` ...) and one long JPG with all slides.
The tool reports any text that leaves its slide or touches the address badge.

## Check it

With `npm run serve` running:

```
node tools/shots.mjs scratch/shots ru 390 844    # one picture per section, and an overflow report
node tools/check.mjs scratch/check               # plays the star, broom, calculator, age, badge, shop and demo parts
```

## Publish

```
npm run deploy         # builds and pushes dist/ to the gh-pages branch
```
