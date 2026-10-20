// THE USER GUIDE'S CHAPTER PAGES -- ROADMAP Task 816. Run with:
//   node dev/lpn-spike/guide-chapter-page-harness.js
//
// A search engine, or an AI asked "how do scenarios work in EPANET++", must land on a page about that
// one chapter, in the asker's language, readable without JavaScript. User-Manual.php is that page
// (`?lang=xx&chapter=<slug>`), and this holds what could go wrong without anyone seeing it:
//
//   1. THE PAGE CARRIES THE CHAPTER'S TEXT, from the language file: every term and definition, in
//      English and in Spanish, and the Spanish is what the Spanish file says (not the English).
//   2. IT CARRIES NO OTHER CHAPTER'S TEXT: a page that is the whole Guide is the page the task replaced.
//   3. THE ADDRESS IS RIGHT: <title> is the chapter's, the canonical and og:url name this chapter in this
//      language on the declared origin, and all 27 hreflang alternates plus x-default name the same
//      chapter. An alternate that dropped the chapter would send a Spanish reader to the index.
//   4. IT IS THE SAME TEXT THE IN-APP GUIDE SHOWS: the application's page renders each chapter's list
//      from the same function, so the list on the chapter page appears, byte for byte, in the app.
//   5. THE SITEMAP LISTS IT, per chapter per language, for the host that owns it.
//   6. THE LANGUAGE MENU AND THE LANGUAGE LINKS KEEP THE CHAPTER.
//
// Each page is rendered by dev/scripts/render_page.php, one page per process.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const path = require('path');
const { execFileSync } = require('child_process');
const ROOT = path.join(__dirname, '..', '..');

let fails = 0, checks = 0;
function ok(name, cond, extra) {
	checks++;
	if (!cond) { fails++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (cond || extra === undefined ? '' : '   ' + extra));
}
function php(args) {
	return execFileSync('php', args, { cwd: ROOT, encoding: 'utf8', maxBuffer: 1 << 28, stdio: ['ignore', 'pipe', 'ignore'] });
}
function render(page, lang, get) {
	const a = ['dev/scripts/render_page.php', page, '--lang=' + lang];
	if (get) { a.push('--get=' + get); }
	return php(a);
}
// Markup out, entities out, white space single: what a reader of the page sees.
const entities = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#039;': "'", '&#39;': "'", '&nbsp;': ' ' };
const plain = (html) => String(html).replace(/<[^>]*>/g, ' ').replace(/&[#\w]+;/g, (e) => entities[e] || e).replace(/\s+/g, ' ').trim();
const norm = (html) => String(html).replace(/\s+/g, '');

// The chapters and their strings, as PHP sees them for a language (English first, the language over it).
function chapters(lang) {
	const script = "$_SERVER['SCRIPT_NAME']='x';require 'lib/Canonical.lib.php';require 'lib/GuideChapters.lib.php';" +
		"require 'lib/lang.ec.en.php';" + (lang === 'en' ? '' : "require 'lib/lang.ec." + lang + ".php';") +
		"$o=array();foreach(ecGuidePageChapters() as $s=>$c){$o[$s]=array('title'=>$ec_lang[$c['title']],'intro'=>ecGuideIntro($s)," +
		"'dl'=>ecGuideDl($s),'terms'=>array_map(function($t) use($ec_lang){return array($ec_lang[$t.'_term'],$ec_lang[$t.'_def']);},$c['terms']));}" +
		"echo json_encode(array('chapters'=>$o,'manual'=>$ec_lang['lpn_help_manual'],'open'=>$ec_lang['lpn_guide_page_open'],'missing'=>$ec_lang['lpn_guide_page_missing']));";
	return JSON.parse(php(['-r', script]));
}

const EN = chapters('en'), ES = chapters('es');
const slugs = Object.keys(EN.chapters);
ok('the Guide has chapters to give an address to (' + slugs.length + ')', slugs.length >= 19);

[['en', EN], ['es', ES]].forEach(([lang, L]) => {
	const slug = 'scenarios', ch = L.chapters[slug];
	const html = render('User-Manual.php', lang, 'chapter=' + slug);
	const text = plain(html.slice(html.indexOf('<main>'), html.indexOf('</main>')));
	console.log('-- ' + lang + ' ' + slug);
	ok(lang + ': the page is HTML with the chapter heading in an h1', html.indexOf('<h1>' + ch.title + '</h1>') > 0);
	ok(lang + ': every term and definition of the chapter is in the page', ch.terms.every((t) => text.indexOf(plain(t[0])) >= 0 && text.indexOf(plain(t[1])) >= 0));
	ok(lang + ': the opening paragraphs are in the page', ch.intro.length > 0 && ch.intro.every((p) => text.indexOf(plain(p)) >= 0));
	if (lang === 'es') {
		ok('es: the page is not the English text', text.indexOf(plain(EN.chapters[slug].terms[0][1])) < 0);
	}
	// No other chapter's words.
	const leaks = slugs.filter((s) => s !== slug).filter((s) => {
		const first = L.chapters[s].terms[0];
		const probe = plain(first[1]).slice(0, 80);
		return probe.length > 20 && text.indexOf(probe) >= 0 && plain(ch.terms.map((t) => t[1]).join(' ')).indexOf(probe) < 0;
	});
	ok(lang + ': no other chapter\'s text is in the page', leaks.length === 0, leaks.join(','));
	const title = (html.match(/<title>([^<]*)<\/title>/) || [])[1];
	ok(lang + ': <title> is the chapter\'s heading, the manual and the product', title === plain(ch.title) + ' - ' + plain(L.manual) + ' - EPANET++', title);
	const want = 'https://epanet-plus-plus.org/engcalcs/User-Manual.php?lang=' + lang + '&amp;chapter=' + slug;
	ok(lang + ': canonical names this chapter in this language', html.indexOf('<link rel="canonical" href="' + want + '" />') > 0);
	ok(lang + ': og:url is the canonical', html.indexOf('<meta property="og:url" content="' + want + '" />') > 0);
	const alts = html.match(/<link rel="alternate" hreflang="[^"]+" href="[^"]+"/g) || [];
	ok(lang + ': 27 hreflang alternates and x-default', alts.length === 28, String(alts.length));
	ok(lang + ': every alternate names the same chapter on the same origin',
		alts.every((a) => /href="https:\/\/epanet-plus-plus\.org\/engcalcs\/User-Manual\.php\?lang=[a-z]{2}&amp;chapter=scenarios"$/.test(a)));
	ok(lang + ': x-default is the English chapter', html.indexOf('hreflang="x-default" href="https://epanet-plus-plus.org/engcalcs/User-Manual.php?lang=en&amp;chapter=scenarios"') > 0);
	const desc = (html.match(/<meta name="Description" content="([^"]*)"/) || [])[1] || '';
	const dplain = plain(desc);
	ok(lang + ': the meta description names the product and the manual, then whole sentences from the chapter',
		dplain.indexOf('EPANET++ - ' + plain(L.manual) + '. ') === 0 && /[.!?]$/.test(dplain) && dplain.indexOf(':') < 0 &&
		plain(ch.intro.join(' ')).indexOf(dplain.slice(dplain.indexOf('. ') + 2).split(/(?<=[.!?]) /)[0]) >= 0, desc);
	ok(lang + ': the meta description is short enough to show (' + dplain.length + ')', dplain.length <= 200);
	ok(lang + ': the page says what the product is, above the chapter', html.indexOf('class="ec-guide-what">EPANET++ ') > 0 && html.indexOf('ec-guide-what') < html.indexOf('<h1>'));
	ok(lang + ': a link opens the application, in this language', html.indexOf('href="https://epanet-plus-plus.org/app/?lang=' + lang + '">' + L.open) > 0);
	ok(lang + ': the other chapters are linked', slugs.every((s) => s === slug || html.indexOf('chapter=' + s + '"') > 0));
	ok(lang + ': the language links keep the chapter', (html.match(/<a href="\/engcalcs\/User-Manual\.php\?lang=[a-z]{2}&amp;chapter=scenarios" lang=/g) || []).length === 27);
});

// 4. The same words as the application's own Guide.
console.log('-- the in-app Guide');
const app = norm(render('Looped-Network.php', 'en'));
const bad = slugs.filter((s) => app.indexOf(norm(EN.chapters[s].dl)) < 0);
ok('every chapter\'s list on the page is, byte for byte, in the application\'s Guide', bad.length === 0, bad.join(','));

// Every chapter renders and carries its heading, in English.
console.log('-- every chapter');
const failed = slugs.filter((s) => {
	const h = render('User-Manual.php', 'en', 'chapter=' + s);
	return h.indexOf('<h1>' + EN.chapters[s].title + '</h1>') < 0 || norm(h).indexOf(norm(EN.chapters[s].dl)) < 0;
});
ok('all ' + slugs.length + ' chapters render with all their text', failed.length === 0, failed.join(','));

// The index, and a chapter that does not exist.
console.log('-- index and unknown');
const idx = render('User-Manual.php', 'es');
ok('the index lists every chapter', slugs.every((s) => idx.indexOf('chapter=' + s + '"') > 0));
ok('the index canonical is the bare page in the language', idx.indexOf('<link rel="canonical" href="https://epanet-plus-plus.org/engcalcs/User-Manual.php?lang=es" />') > 0);
ok('the index carries no chapter text', slugs.every((s) => plain(idx).indexOf(plain(ES.chapters[s].terms[0][1]).slice(0, 60)) < 0));
['snip', 'notes', 'user-manual', 'nonsense'].forEach((x) => {
	const u = render('User-Manual.php', 'en', 'chapter=' + x);
	ok('chapter ' + x + ' has no page: it shows the index and a not-found line', !slugs.includes(x) && u.indexOf(EN.missing) > 0 && u.indexOf('<link rel="canonical" href="https://epanet-plus-plus.org/engcalcs/User-Manual.php?lang=en" />') > 0);
});
const unk = render('User-Manual.php', 'en', 'chapter=nonsense');
ok('an unknown chapter renders the index and does not echo the request', unk.indexOf('nonsense') < 0 && unk.indexOf('<link rel="canonical" href="https://epanet-plus-plus.org/engcalcs/User-Manual.php?lang=en" />') > 0);
const ar = render('User-Manual.php', 'ar', 'chapter=map');
ok('a right-to-left language sets the direction', /<html lang="ar" dir="rtl">/.test(ar));
const menu = render('User-Manual.php', 'en', 'chapter=map');
ok('the language menu keeps the chapter', /class="dropdown-item" lang="es" href="[^"]*\?lang=es&amp;chapter=map"/.test(menu) || menu.indexOf('lang=es&amp;chapter=map') > 0);

// 5. The sitemap.
console.log('-- sitemap');
const sm = php(['dev/scripts/generate_sitemap.php', '--host=epanet-plus-plus.org']);
const locs = sm.match(/<loc>[^<]*User-Manual[^<]*<\/loc>/g) || [];
ok('the host sitemap lists the index and every chapter in 27 languages (' + locs.length + ')', locs.length === (slugs.length + 1) * 27, String(locs.length));
ok('it lists the Spanish scenarios chapter', sm.indexOf('<loc>https://epanet-plus-plus.org/engcalcs/User-Manual.php?lang=es&amp;chapter=scenarios</loc>') > 0);
const main = php(['dev/scripts/generate_sitemap.php', '--stdout']);
ok('hawsedc.com\'s own sitemap does not list them', main.indexOf('User-Manual') < 0);

console.log('\n' + (fails ? 'FAIL: ' + fails + ' of ' + checks : 'PASS: ' + checks + ' checks'));
process.exit(fails ? 1 : 0);
