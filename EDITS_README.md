# Policy changes explorer

Open index.html, then select All additions or All deletions. The original reveal.js presentation is retained.

The two new pages play each year's fragments in source order at 1 transition per second and loop within that year. Select a year from the horizontal timeline or drag its slider. Pause, previous, and next controls allow reading at your own pace. Space toggles playback; left/right arrows step when focus is outside a control. Reduced-motion preferences start playback paused.

Animated type is capped at 2em and shrinks to fit. Phrases longer than 100 words display the first 100 words followed by an ellipsis. Complete source text remains in assets/additions.txt and assets/deletions.txt. Every fragment displays its revision date and links to that policy version. Empty years are explicitly marked with no changes recorded.

Data: Google_Privacy_Policy_Added_Text_1999-2026.txt and Google_Privacy_Policy_Deleted_Text_1999-2026.txt from google-policy-diff, copied on November 4, 2026. Contains 1,253 addition fragments and 1,057 deletion fragments through October 16, 2026. The initial 1999 policy is a baseline, not counted as an addition. These are computed text differences, not Google's original HTML track-change markup.

No new build step or dependencies are required. The new pages load their data as a local JavaScript asset, so they also work when opened directly from disk. Existing reveal.js files and external Google Fonts remain as supplied.

New files: additions.html, deletions.html, assets/edits.css, assets/edits.js, assets/policy-data.js, assets/additions.txt, assets/deletions.txt.
Changed file: index.html (title and two links on the opening slide).
