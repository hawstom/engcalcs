# Desktop platforms: a plan

Written 2026-09-30, for roadmap priority 75. Tom asked: *"Plan where/how to move the project to
transcend the web-centric hawsedc.com/engcalcs folder. Windows or Linux? Plan what platforms and
what frameworks to experiment with. I'm thinking about Windows, Linux, Mac; Flutter, Tauri, (not
Electron, Qt, or .NET MAUI?)"*

**Name clash:** `dev/cross-platform-planning.md` is about how Claude Code and Copilot share the
work. It has nothing to do with this. This plan is about desktop apps.

## The short answer

- **Keep one repository.** Do not move the code. Add a desktop folder that builds apps from the
  same pages the web site serves.
- **Get rid of PHP at build time, not at run time.** A script writes every page, in every language,
  as a plain HTML file. The desktop app carries those files. The web site keeps running PHP exactly
  as it does now.
- **Try Tauri first, on Windows, with the Looped Network page in English.** About 3 to 5 days.
- **Keep WSL as the home.** Windows and Mac packages get built by a free build service on GitHub
  (or on the Windows side of the same PC), not by changing where we work.
- **Flutter means rewriting the whole suite.** Set it aside unless Tom wants that.

## 1. Where the code should live

The folder name is a web address, but the code does not depend on it; the suite already runs at
three addresses from one checkout. What ties it to a web server is PHP. Every page asks PHP for its strings when it is loaded
(about 4,100 lines of English strings, times 27 languages), and a few features call back to the
server: the file-lock service (`lpn-lock.php`), the usage logs, the contact form, and the
generated service worker and install manifest.

**One repository or two?** One. A second repository would mean keeping two copies of 81,000 lines of JavaScript
and 27 language files in step for ever. The desktop app should be another way of *packaging* the suite, built from the same
commit as the web site.

**How to handle PHP. Three options:**

| Option | What it means | Verdict |
|---|---|---|
| A. Render the pages at build time | A script runs each page through PHP once per language and saves plain HTML. About 35 pages × 27 languages, roughly 950 files. The app carries them. Switching language opens a different file. | **Recommended.** We already have the tool (`dev/scripts/render_page.php`, which renders one page in any language exactly as a visitor would get it). Nothing on the web site changes. |
| B. Ship PHP inside the app | Bundle a PHP program and a small web server in every install. | Rejected. It adds tens of megabytes, a second program to keep patched on three systems, and a local server that a firewall may block. |
| C. Move the strings into JavaScript | The page loads its strings as data and fills itself in. | Worth doing someday for its own reasons, but it touches every page and every check we have. Too big for a first step. |

**Smallest first step:** render `Looped-Network.php` in English to a folder with its scripts and
styles, open it in a plain browser with no PHP behind it, and list what breaks. We expect: the
language menu links, the lock service, the usage logs, the service worker and the install
prompt. That list is the real size of the desktop job, and it costs about a day to get.

## 2. Windows or Linux as the working home

**Stay in WSL.** All our checks, harnesses and habits live there. What changes is only where the
*packages* are built.

| Package | What it needs | How we would get it |
|---|---|---|
| Linux | Linux with WebKitGTK 4.1 | Built right here in WSL. Testing on the screen works through WSLg. |
| Windows | Windows with Microsoft's build tools and WebView2, which Windows 10 and 11 already have | Built on the Windows side of the same PC, or by GitHub's free build service. Tauri can build a Windows installer from Linux, but its own documentation calls that "not as straight forward" and "not tested as much". |
| Mac | **A Mac, always.** Apple requires one for signing. Notarizing (the check that stops Macs warning "unidentified developer") needs a paid Apple developer account, $99 a year. | GitHub's build service rents Mac machines, free for public repositories. Signing still needs the paid account. |

So the honest answer to "Windows or Linux?" is: **neither alone.** Write and test in WSL, and let
GitHub's build service produce all three packages from each release commit, so nobody needs to own
a Mac. **Question for Tom: do you or Mary have a Mac?** If not, the Mac app has to wait until
somebody can try it on a real Mac.

Sources: [Tauri prerequisites](https://v2.tauri.app/start/prerequisites/),
[Tauri Windows installer, cross-compiling](https://v2.tauri.app/distribute/windows-installer/),
[Tauri macOS signing](https://v2.tauri.app/distribute/sign/macos/),
[tauri-action for GitHub builds](https://github.com/tauri-apps/tauri-action),
[GitHub Actions billing](https://docs.github.com/en/billing/managing-billing-for-github-actions/about-billing-for-github-actions).

## 3. Frameworks

What the suite needs from any desktop wrapper:

1. Run the EPANET engine, which is WebAssembly.
2. Open and save project files. On the web this is the browser's file picker. On the desktop it
   should be better: real file paths, and "recent files" that survive.
3. Fetch map tiles and search from the internet.
4. Keep the file-lock feature for teams sharing a network drive.
5. All 27 languages, including the right-to-left ones (Arabic, Persian, Hebrew, Urdu, Pashto).
6. Do not damage the phone experience.

**Tauri.** A small shell (written in Rust) around the web viewer the computer already has: Edge's
WebView2 on Windows, Safari's engine on Mac, WebKitGTK on Linux. Our JavaScript runs as it is.
A minimal Tauri app is "less than 600KB" because it does not carry its own browser.
- EPANET WebAssembly: runs in all three viewers.
- Files: **this is the one real piece of work.** The browser file picker we use today is a
  Chrome and Edge feature; Safari's engine does not have it, so on Mac and Linux it would be missing.
  Tauri's own file dialog gives real paths on all three. That is one adapter in our open/save code,
  and it is the better behaviour anyway.
- Maps: work over the network as now. OpenStreetMap's tile rules require the app to identify
  itself properly; check before release.
- Locks: calling hawsedc.com's lock service from an app needs a server change. Better: with real
  paths, the lock becomes a small file beside the project on the shared drive, as Word does it.
- Languages: the pre-rendered files carry them. Right-to-left is the viewer's job and all three
  handle it.
- Phone: untouched, because the web site does not change.

Sources: [Tauri, what it is](https://v2.tauri.app/start/),
[Tauri dialog plugin](https://v2.tauri.app/plugin/dialog/),
[file picker browser support](https://caniuse.com/native-filesystem-api),
[OSM tile usage policy](https://operations.osmfoundation.org/policies/tiles/).

**Flutter.** Google's framework, in its own language (Dart), drawing its own screens. It cannot run
our JavaScript except inside a web-viewer add-on. Google's own add-on supports Android, iOS and Mac
only; the best-known alternative adds Windows but **not Linux**. So Flutter is either a
worse Tauri with no Linux, or a **rewrite of about 81,000 lines** (57,000 in the Looped Network
page alone) and every harness, in a language nobody here uses. That is years, and the web site
becomes a separate program. **Recommend setting it aside.**
Sources: [webview_flutter platforms](https://pub.dev/packages/webview_flutter),
[flutter_inappwebview platforms](https://inappwebview.dev/docs/intro/),
[Flutter desktop](https://docs.flutter.dev/platform-integration/desktop).

**Why the other three were reasonably set aside:**
- **Electron** runs our code as is, but every install carries its own Chrome, 100 MB or more.
  Keep it in reserve as the fallback if Linux's viewer is too weak. [Electron](https://www.electronjs.org/docs/latest/)
- **Qt**: **the licence is not the obstacle** (it is offered under GPL v3 and LGPL v3, which fit
  ours). The obstacle is a C++ rewrite, or using Qt only as a web viewer: Electron's size, more work. [Qt open-source licensing](https://www.qt.io/licensing/open-source-lgpl-obligations)
- **.NET MAUI** is C#, has **no Linux**, and needs a Mac for Mac builds. [What is .NET MAUI](https://learn.microsoft.com/en-us/dotnet/maui/what-is-maui)

**Does the installable web app already cover this?** Partly. On Windows, Chrome and Edge already
install the suite in its own window, offline, with the file picker: most of what Tauri would give a
Windows user. A desktop build adds real file paths and double-click to open a `.inp`; proper
saving on Mac and Linux; no need for a browser's install button (Firefox has none); app stores; and
a suite that survives the web site, which fits the GPL argument. **If those do not matter, the
cheapest plan is to promote the install we already have.** [PWA installation](https://web.dev/learn/pwa/installation)

## 4. Staged experiments

**Spike 1 (3 to 5 days). Tauri, Windows, Looped Network, English.**
Render the page, wrap it, build on Windows. Proves or disproves: EPANET runs, a map draws, Net1
opens and saves through a real file dialog, and our checks still pass with the new folder.

**Spike 2 (2 to 3 days). Same app on Linux, in WSL.**
Trouble is likeliest here: WebKitGTK is the weakest viewer. Watch drawing speed on Net3.

**Step 3 (about a week). All pages, all 27 languages.**
Render everything; the language menu switches files; usage logs and contact form are turned off
or pointed at the web site (a consent question).

**Step 4 (about a week). Build service and Mac.**
GitHub builds all three packages from a tagged commit. Unsigned at first, for us and a few testers.

**Step 5. Signing, updates and stores, only after testers say it earns its keep.**

**Risks and costs:**
- **Linux viewer differences.** WebKitGTK lags behind; some feature may be missing or slow.
  Electron is the fallback.
- **Code signing.** Windows warns about unsigned installers. Microsoft's Trusted Signing is about
  $9.99 a month; a traditional certificate is $400 to $900 a year. Mac needs Apple's $99 a year.
  [Trusted Signing pricing](https://www.gdgsoft.com/faq/azure-trusted-signing-cost-effective-exe-code-signing)
- **Updates. The biggest new burden.** An app updates only through an update channel (Tauri has
  one) or a store; otherwise old copies with old bugs live for years. It is a second release line. [Tauri updater](https://v2.tauri.app/plugin/updater/)
- **Store fees.** Microsoft Store is now free for individual developers. Apple's App Store needs
  the $99 a year account. Linux stores (Flathub, Snap) are free.
  [Microsoft Store announcement](https://blogs.windows.com/windowsdeveloper/2025/09/10/free-developer-registration-for-individual-developers-on-microsoft-store/)
- **Mapbox key.** It would ship inside every copy; revoking it would break old copies.
- **What is stored on a visitor's device** changes: real file paths and recent-file lists. Tom must
  hear about it, and `consent_body` and the storage inventory need review.

## 5. What this changes in the public claims (for Tom)

Nothing changes until a desktop build ships. Then:

- **"It is a web application"** stays true of the site. *"Also available as a desktop app for
  ..."* would be new, naming **only platforms actually tested** (the *"a phone"* rule).
- **"PC application" stays retired**; a download is no reason to revive it.
- **The four third-party requests** stay four only if the app talks to the same services. An
  update check is a fifth, and a new paragraph in `privacy.php`.
- **Phone claim:** unchanged.

**Decisions for Tom:** (1) Are real file paths and Mac/Linux saving worth a second release line,
or is promoting the existing install enough? (2) Who has a Mac? (3) Spend on signing, or stay
unsigned for testers only?
