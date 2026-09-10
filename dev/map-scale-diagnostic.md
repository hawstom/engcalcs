# The thirty-second map diagnostic

**What it is for.** On 2026-09-09 MJH reported a completely blue map, a rubber band scaled
completely wrong, and a map he could not edit at all -- surviving a reload and a full page reset.
The MECHANISM was reproduced in a real browser and fixed the same day (`setTransform()` is now the
one seam for the view and the stroke sizes, and a bad measurement is refused rather than becoming a
transform). **What was NOT reproduced is the environmental trigger**, so this snippet exists to find
out whether his browser still produces it and, if so, what makes it.

**Give this to the person seeing the problem.** They open the map, open the browser console, paste
it, and send back what it prints.

```js
(function(){var s=document.getElementById('lpn_canvas'),g=s&&s.querySelector('g'),
c=s&&getComputedStyle(s),r=s&&s.getBoundingClientRect(),L=s&&s.querySelector('.lpn-link'),
p=function(n){return c?(c.getPropertyValue(n).trim()||'(unset)'):'?'},
m=g?/scale\(([^)]+)\)/.exec(g.getAttribute('transform')||''):null,sc=m?parseFloat(m[1]):null,
t=function(f){try{return String(f())}catch(e){return 'threw '+e.name}};
console.log({canvas:r&&[r.x,r.y,r.width,r.height],heightAttr:s&&s.getAttribute('height'),
transform:g&&g.getAttribute('transform'),scale:sc,sym:p('--lpn-sym'),lw:p('--lpn-lw'),
hit:p('--lpn-hit'),hair:p('--lpn-hair'),
pipePx:(L&&sc)?parseFloat(getComputedStyle(L).strokeWidth)*sc:null,
underMiddle:r?(function(e){return e?(e.id||e.getAttribute('class')||e.tagName):null;}
  (document.elementFromPoint(r.left+r.width/2,r.top+r.height/2))):null,
win:[innerWidth,innerHeight,devicePixelRatio],
ctm:t(function(){return s.getScreenCTM();}),
store:t(function(){return localStorage.length;})});}())
```

## Reading the answer

**`pipePx` IS THE QUESTION.** It is the pipe's stroke width in real screen pixels. It should be a
few. This defect makes it thousands -- measured at **4,535 px** on the lat/lon Net3 example at
6,479 px per degree, which is what paints 44% of the canvas one flat blue.

- `hit` should be a small number of WORLD units, and `hit x scale` should come to about 12 screen
  pixels. If `hit` prints `(unset)` the stylesheet falls back to a bare `12`, read as 12 WORLD
  units -- **77,745 screen pixels** at that scale, which is why nothing can be clicked.
- `underMiddle` says what is actually under the centre of the map. On a healthy drawing it is
  usually `lpn_canvas` or a node; if it is `lpn-link-hit` everywhere, the grab bands have swallowed
  the map.
- `scale` and `canvas` together say whether the page measured itself. A canvas of zero width or
  height, or a scale that is `null`, `0`, negative or not finite, is the input this bug needs.
- `ctm` and `store` are there to catch a privacy extension: either can print `threw <Name>` and that
  is a finding, not an error in the snippet.

## Then, and this is the half the snippet cannot do

**Reload with the console open and "Persist" / "Preserve log" ticked, and copy every red line.** An
exception thrown early in boot is invisible afterwards, and it is the one thing this cannot see for
itself.

## And one question worth more than the extension list

**Does it happen on the SECOND gallery card (Elm Street Center, an XY project) as well as the first
(Net3, lat/lon)?** The mechanism above only bites a GEOGRAPHIC project, because it is the large
world-to-screen scale that turns a fallback into a wash. **If only the geographic one breaks, that
confirms this mechanism. If both break, it is something else** and the extension list becomes the
next thing to ask for.
