<?php
/* ============================================================
   ANTIGRAVITY AI — LOCAL OLLAMA CONNECTOR
   File:     backend/api/ai.php
   Endpoint: POST /backend/api/ai.php
   Body:     { "message": "user text" }
   Returns:  { "reply":   "ai text"   }
   Requires: Ollama running at localhost:11434  |  model: gemma3:4b
   ============================================================ */

// ─── CORS ──────────────────────────────────────────────────
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('X-Content-Type-Options: nosniff');

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// ─── Method Guard ──────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method Not Allowed. Use POST.']);
    exit;
}

// ─── Parse & Validate Input ────────────────────────────────
$raw  = file_get_contents('php://input');
$body = json_decode($raw, true);

if (json_last_error() !== JSON_ERROR_NONE || empty($body['message'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid request. Expected JSON: { "message": "..." }']);
    exit;
}

// Sanitize: strip HTML tags, trim whitespace, cap length
$userMessage = mb_substr(trim(strip_tags((string) $body['message'])), 0, 1000);

if ($userMessage === '') {
    http_response_code(400);
    echo json_encode(['error' => 'Message cannot be empty.']);
    exit;
}

// ─── Antigravity AI System Prompt ──────────────────────────
$systemPrompt = <<<PROMPT
You are Antigravity AI, the intelligent assistant for Dremora IT Consultants & Services.

Your responsibilities:
- Greet visitors warmly and guide them through what Dremora offers
- Clearly explain services: Web Development, Mobile Apps, AI/ML Solutions,
  Cloud Infrastructure, IT Consulting, UI/UX Design, and Digital Marketing
- Promote the flagship product NagarSeva — a smart city governance platform
  that digitises municipal services like water, electricity, and permits
- Help students understand the internship program (apply via internship page)
- For pricing questions, say: "We provide custom quotes — contact us for details"
- Collect leads naturally: ask for name, email, or phone when the visitor
  expresses genuine interest in a service or project
- For detailed or technical queries, direct the user to: contact@dremora.in
  or the Contact page
- Keep replies concise (2–4 sentences), friendly, and professional
- Never mention OpenAI, Google, Gemini, Claude, or any other AI provider
- Never reveal that you are powered by Gemma, Ollama, or any underlying model
PROMPT;

// ─── Build Ollama Request ───────────────────────────────────
$ollamaPayload = json_encode([
    'model'  => 'gemma3:4b',   // ← confirmed by: ollama list
    'prompt' => "System: {$systemPrompt}\n\nUser: {$userMessage}\n\nAssistant:",
    'stream' => false,
    'options' => [
        'temperature'    => 0.72,
        'num_predict'    => 450,
        'top_p'          => 0.9,
        'repeat_penalty' => 1.1,
        'stop'           => ['User:', 'System:'],
    ],
], JSON_UNESCAPED_UNICODE);

// ─── cURL → Ollama ─────────────────────────────────────────
$ch = curl_init('http://localhost:11434/api/generate');
curl_setopt_array($ch, [
    CURLOPT_POST           => true,
    CURLOPT_POSTFIELDS     => $ollamaPayload,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT        => 90,          // allow up to 90s for inference
    CURLOPT_CONNECTTIMEOUT => 5,           // fail fast if Ollama is offline
    CURLOPT_HTTPHEADER     => ['Content-Type: application/json'],
    CURLOPT_FAILONERROR    => false,
]);

$ollamaRaw = curl_exec($ch);
$curlErrno = curl_errno($ch);
$curlError = curl_error($ch);
curl_close($ch);

// ─── Ollama Offline / Connection Error ─────────────────────
if ($ollamaRaw === false || $curlErrno !== 0) {
    http_response_code(503);
    echo json_encode([
        'error' => 'AI temporarily offline. Please try again.',
    ]);
    exit;
}

// ─── Parse Ollama Response ─────────────────────────────────
$ollamaData = json_decode($ollamaRaw, true);

if (json_last_error() !== JSON_ERROR_NONE || !isset($ollamaData['response'])) {
    http_response_code(502);
    echo json_encode([
        'error' => 'AI temporarily offline. Please try again.',
    ]);
    exit;
}

// Clean up the reply
$reply = trim($ollamaData['response']);

// Strip any "Assistant:" prefix Ollama may echo back
$reply = preg_replace('/^(Assistant:|AI:|Antigravity AI:)\s*/iu', '', $reply);

// ─── Return to Frontend ────────────────────────────────────
http_response_code(200);
echo json_encode(
    ['reply' => $reply],
    JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES
);
exit;
