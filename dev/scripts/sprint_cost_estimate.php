<?php
/**
 * sprint_cost_estimate.php — how much will this sprint cost, and how many agents fit in a wave?
 *
 * WHY THIS EXISTS (Tom, 2026-08-13): Task 251 hit an account session limit THREE times, and each
 * time roughly twenty agents died mid-flight. Tom: "Do you have a way of checking the available
 * tokens before hitting a session limit and accordingly adjusting the number of subagents?"
 *
 * THE HONEST ANSWER IS NO, AND THAT MATTERS FOR HOW THIS SCRIPT IS BUILT. Nothing on this machine
 * exposes remaining account quota:
 *   - `claude` has no usage/limit subcommand.
 *   - ~/.claude holds no quota, usage, or limit state file.
 *   - Session transcripts record `rate_limit` errors only AFTER they fire, never a remaining
 *     balance beforehand.
 * So this script does NOT claim to know what is left. It estimates what a sprint WILL COST, from
 * this project's own measured history, and converts that into a wave size. Budgeting, not querying.
 *
 * THE COST MODEL, measured from the Task 251 agents' reported subagent_tokens:
 *      es   3 keys ->  66,123        tr  64 keys ->  90,178
 *      fr  47 keys -> 123,320        sr 289 keys -> 104,686
 *      es  61 keys ->  89,647        fa 289 keys -> 124,763
 *      pt  61 keys ->  90,449        it 289 keys -> 140,532
 *
 * THE FIXED COST DOMINATES, AND THAT IS THE WHOLE INSIGHT. A three-key agent cost 66k tokens --
 * over half what a 289-key agent cost. The agent must read the brief, the payload, the glossary
 * and its language file before translating one word, and that floor is paid per agent regardless
 * of delta. Hence ~65k fixed + ~200/key, and hence: FEWER, FULLER AGENTS BEAT MORE, SMALLER ONES.
 * Splitting one 289-key agent into four 73-key agents nearly triples the bill.
 */

const FIXED_TOKENS_PER_AGENT = 65000;   // brief + payload + glossary + lang file read
const TOKENS_PER_KEY         = 200;     // marginal translation cost
const DEFAULT_BUDGET         = 2000000; // tokens per wave; see --budget

$payloadDir = __DIR__ . '/../translation_payloads';
$budget     = DEFAULT_BUDGET;
$concurrency= 20;                       // harness cap on simultaneous subagents

foreach (array_slice($argv, 1) as $arg) {
    if (preg_match('/^--budget=(\d+)$/', $arg, $m))      $budget = (int)$m[1];
    elseif (preg_match('/^--concurrency=(\d+)$/', $arg, $m)) $concurrency = (int)$m[1];
    elseif ($arg === '--help') {
        echo "Usage: php sprint_cost_estimate.php [--budget=N] [--concurrency=N]\n";
        echo "  --budget       tokens available for one wave (default " . number_format(DEFAULT_BUDGET) . ")\n";
        echo "  --concurrency  max simultaneous agents the harness allows (default 20)\n";
        exit(0);
    }
}

$agents = [];
foreach (glob($payloadDir . '/payload_*.json') as $file) {
    $data = json_decode(file_get_contents($file), true);
    if (!$data) continue;
    $lang = preg_replace('/^payload_|\.json$/', '', basename($file));
    $keys = count($data['keys_to_translate'] ?? []);
    if ($keys === 0) continue;                       // already complete; costs nothing
    $agents[$lang] = ['keys' => $keys, 'cost' => FIXED_TOKENS_PER_AGENT + $keys * TOKENS_PER_KEY];
}

if (!$agents) {
    echo "Nothing to translate: every payload has an empty delta.\n";
    exit(0);
}

uasort($agents, fn($a, $b) => $b['cost'] <=> $a['cost']);

$totalKeys = array_sum(array_column($agents, 'keys'));
$totalCost = array_sum(array_column($agents, 'cost'));
$avgCost   = (int)round($totalCost / count($agents));

echo "Sprint cost estimate\n";
echo str_repeat('-', 60) . "\n";
printf("Languages with work:  %d\n", count($agents));
printf("Keys outstanding:     %s\n", number_format($totalKeys));
printf("Estimated cost:       %s tokens  (~%s per agent)\n",
    number_format($totalCost), number_format($avgCost));
echo "\n";

// How many agents fit in one wave: the tighter of the budget and the harness cap.
$byBudget = 0; $running = 0;
foreach ($agents as $a) {
    if ($running + $a['cost'] > $budget) break;
    $running += $a['cost']; $byBudget++;
}
$waveSize = max(1, min($byBudget, $concurrency));
$waves    = (int)ceil(count($agents) / max(1, $waveSize));
$limiter  = $byBudget < $concurrency ? 'token budget' : 'harness concurrency cap';

printf("Budget per wave:      %s tokens\n", number_format($budget));
printf("Fits in one wave:     %d agents  (limited by %s)\n", $waveSize, $limiter);
printf("Waves needed:         %d\n", $waves);
echo "\nLaunch the largest deltas first -- a wave that dies mid-flight then costs\n";
echo "the fewest re-reads, because the finished agents are the expensive ones.\n\n";

$i = 0;
foreach ($agents as $lang => $a) {
    if ($i % $waveSize === 0) printf("  -- wave %d --\n", intdiv($i, $waveSize) + 1);
    printf("  %-3s %4d keys  ~%s tokens\n", $lang, $a['keys'], number_format($a['cost']));
    $i++;
}

echo "\nThis is a BUDGET, not a quota reading. Nothing local reports remaining account\n";
echo "capacity, so treat a wave that dies as information: halve --budget and re-run.\n";
