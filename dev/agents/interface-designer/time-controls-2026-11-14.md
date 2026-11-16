# Ida: time controls (Tom, 2026-11-14)
Tags: OBSERVED = rendered or read in this worktree; SPECULATION = my inference. Shots in /tmp/claude-1000/ida-time/ (d1440, d1366, p390, p390-tables, p390-empty, p390-net2).

## What is true today
- OBSERVED: the phone has the transport on an extended-period project (Net1, Net2, Net3 at 390x844). One 38 px row, 281 px wide, seven controls. It stays visible above an open Tables pane.
- OBSERVED: a steady-state project hides the whole transport; on the phone the toolbar is then 5 px. This is the likely reason Tom saw nothing. SPECULATION: ask which project he had open; a stale cached page is the other candidate.
- OBSERVED: transport is 322 px wide on desktop. At 1440 it fits on row one. At 1366 and 1280 it pushes Find and the pane toggle to a second toolbar row: canvas starts at 151 px, against 118 slimmed and 115 with no transport. Chrome is 19.7% of a 1366x768 window, 15.4% slimmed. At 1024 and below the strip wraps anyway.
- OBSERVED: it is the only bordered button group on a flat icon strip, so it is the loudest group and among the least used.
- OBSERVED: the Time series graph draws a "now" line at the transport's time and cannot be clicked.
- OBSERVED: results readable on a phone today: Tables (half the screen), Time series, Profile, the map itself. Every one of them reads the instant the transport holds, so on a phone the transport is the only way to change the instant.

## Options, ranked
1. Slim the strip (small). Clock chip, Back, Play, Forward stay; Restart, End, speed move to a popover on the chip (the Find popup is the precedent). 322 px to about 171. Desktop: one row again at 1280 and 1366. Phone: row stays, with room. Trades: Restart/End/speed one tap deeper.
2. Seek on the graph (small to medium). Drag or click the now line; also a Play on the graph header. Second door, no toolbar cost, works on a phone with the pane open. Trade: only while a graph is showing; not a replacement.
3. A time bar on the map's bottom edge, EPS projects only (medium to large). The toolbar loses the transport completely. Desktop and phone: one 34 px bar above the footer. Trades: it covers or reserves drawing height, and it collides with the legend, scale and credit that already live there.
4. A Time button on the toolbar that opens the transport as a popover (small to medium). Permanent cost one icon (34 px). Trades: nothing visible while stepping through a run, unless pinned; two taps to play.
5. A dockable Time box, as WaterGEMS has it (medium). Zero permanent cost. Trades: Tom already found it confusing; auto-hidden means unseen; on a phone it is a strip and a half-screen sheet that hides the map the control changes.

## Recommendation
Option 1 now, option 2 after it. Together they give a clock always, controls when stepping, and a second door from the chart, with no new words (the names already exist). Keep option 3 in reserve only if Tom wants the toolbar emptied of time entirely.
