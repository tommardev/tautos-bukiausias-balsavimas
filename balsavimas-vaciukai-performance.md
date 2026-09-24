# Performance: balsavimas-vaciukai.web.app

Lab check of the public homepage on 22 Sep 2026. Chrome DevTools navigation traces. No real-user CrUX record exists for this URL, so nothing below is a field p75.

## Conditions

|               |                                                                                                                                                                                             |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| URL           | https://balsavimas-vaciukai.web.app/                                                                                                                                                        |
| State         | Public, logged-out                                                                                                                                                                          |
| Device        | Phone, 412×823, DPR 1.75, touch                                                                                                                                                             |
| Network / CPU | Slow 4G, 4× CPU                                                                                                                                                                             |
| Runs          | 3 reloads. Headline figures are the median; range in parentheses                                                                                                                            |
| Cache         | Third-party scripts (jsDelivr, Google Fonts) were already cached (1–2 ms). First-party CSS is `Cache-Control: no-cache, must-revalidate`, so it revalidates every visit. HTML is `no-store` |

## Results

| Signal           | Result                                        | Rating                                     |
| ---------------- | --------------------------------------------- | ------------------------------------------ |
| LCP              | **2.24 s** (2.18–2.30 s)                      | Good (under 2.5 s)                         |
| LCP element      | `p.show-subtitle` (text already in the HTML)  | —                                          |
| TTFB             | **91 ms** (83–92 ms)                          | Good                                       |
| Render delay     | **2.15 s**, 96% of LCP                        | The actual wait                            |
| CLS              | **0.156** on all 3 runs                       | Needs improvement (over 0.1)               |
| Tap → next paint | Sąrašas **240 ms**, Mokiniai filter **88 ms** | One lab sample under 4× CPU, not field INP |
| CrUX             | No data                                       | Unavailable, not a pass                    |

Per run:

| Run        |     LCP |  TTFB | Render delay |  CLS |
| ---------- | ------: | ----: | -----------: | ---: |
| 1          | 2295 ms | 92 ms |      2203 ms | 0.16 |
| 2          | 2175 ms | 83 ms |      2092 ms | 0.16 |
| 3 (median) | 2239 ms | 91 ms |      2147 ms | 0.16 |

The server responds quickly. Paint waits on CSS. The page then shifts when the chart is inserted.

## Causes

**CSS is discovered in two steps.** `style.css` is 882 bytes and `@import`s 12 sheets (`tokens`, `base`, `responsive`, and component files for header, leaderboard, chart, contestants, dock, activity, modal, toast, scroll-top). Those requests cannot start until the parent sheet is parsed. On the median run that chain lines up with the 2.15 s render delay. Head order makes it worse on a cold visit: Google Fonts, then parser-blocking `canvas-confetti`, `chart.js` (206 KB), and `chartjs-plugin-datalabels`, and only then `style.css`.

**The chart has no reserved space.** `#votesChartContainer` is empty in the HTML. At ~3.5 s, `chart.js` injects a chart about 420 px tall. `#votingSection` moves from y=553 to y=973. That move is the entire 0.156 shift. The canvas wrapper has a min-height, but it does not exist until JavaScript runs. Chart.js also forced a 95 ms reflow while measuring labels (`_computeLabelSizes`).

**Live data is a deep module chain.** On run 1 the longest chain was **4.3 s**: document → `src/main.js` → `src/ui/render.js` → `src/ui/contestants.js` → `firebase-firestore.js` (440 KB uncompressed) → `firebase-app.js` (103 KB) → the Firestore listen channel. Standings cannot update before that. Main-thread time from third parties on that run: jsDelivr 209 ms, Google CDN 98 ms.

**Repeat visits still revalidate CSS.** Files are versioned (`?v=1.3.1`) but served `no-cache, must-revalidate`, so each of the 13 stylesheets pays a round trip again.

## Changes, in order

1. **Reserve the chart.** Set a min-height near 420 px on `#votesChartContainer` in CSS that is present before `chart.js` runs. This is the CLS fix.
2. **One stylesheet.** Link a single CSS file from the document. Remove the `@import` chain in `style.css`. This is most of the 2.15 s render delay.
3. **Stop blocking the parser.** Load Chart.js, confetti, and datalabels with `defer`, or import them when the chart or celebration actually runs. On a first visit Chart.js currently downloads before CSS discovery continues.
4. **Shorten the module chain.** Bundle local modules, or preload the Firebase entry, so Firestore is not six requests deep. Target is time-to-live-standings (4.3 s on run 1), not LCP.
5. **Cache versioned CSS** with a long `max-age`. Keep HTML `no-store`.

## Not claimed

- Field Core Web Vitals. CrUX has no phone or desktop sample for this URL.
- A cold-cache LCP. These three runs hit cached jsDelivr and Google Fonts. A first visit pays for Chart.js before the stylesheet.
- The render-blocking insight’s 8.1 s savings figure from run 1. Runs 2 and 3 estimated 0 ms, and observed LCP is 2.2 s. The CSS chain matches the measured 2.15 s render delay; use that.
