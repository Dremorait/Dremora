<?php
/* ============================================================
   ANTIGRAVITY AI — LOCAL OLLAMA CONNECTOR
   Endpoint: POST /api/ai.php
   Body:     { "message": "user text" }
   Returns:  { "reply": "ai text" }
   Requires: Ollama running on localhost:11434, model gemma:4b
   ============================================================ */

// ---- CORS Headers ----
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('X-Content-Type-Options: nosniff');

// Handle CORS preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// ---- Method Guard ----
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method Not Allowed. Use POST.']);
    exit;
}

// ---- Parse Request Body ----
$raw  = file_get_contents('php://input');
$body = json_decode($raw, true);

if (json_last_error() !== JSON_ERROR_NONE || !isset($body['message'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON body. Expected { "message": "..." }']);
    exit;
}

$userMessage = trim(strip_tags((string) $body['message']));
if ($userMessage === '') {
    http_response_code(400);
    echo json_encode(['error' => 'Message cannot be empty.']);
    exit;
}

// ---- System Prompt ----
$systemPrompt = <<<PROMPT
You are Antigravity AI, the intelligent assistant for Dremora IT Consultants & Services.
Your role:
- Warmly welcome visitors and guide them through Dremora's services
- Explain services: Web Development, App Development, AI/ML Solutions, Cloud Infrastructure, IT Consulting, UI/UX Design
- Highlight the flagship NagarSeva project (smart city governance platform)
- Share information about internship programs for students
- Answer questions about pricing, timelines, and tech stacks professionally
- Collect leads by asking for name, email, or phone when appropriate
- Direct complex queries to the contact page or email: contact@dremora.in
- Keep responses concise, warm, and professional (2-4 sentences max unless asked for detail)
- Never make up specific pricing — say "Contact us for a custom quote"
- Never mention OpenAI, Google, Gemini, or any external AI provider
PROMPT;

// ---- Ollama Payload ----
$ollamaPayload = json_encode([
    'model'  => 'gemma3:4b',   // gemma4 in Ollama = gemma3:4b tag
    'prompt' => "System: {$systemPrompt}\n\nUser: {$userMessage}\n\nAssistant:",
    'stream' => false,
    'options' => [
        'temperature'    => 0.7,
        'num_predict'    => 400,
        'top_p'          => 0.9,
        'repeat_penalty' => 1.1,
    ],
]);

// ---- cURL to Ollama ----
$ch = curl_init('http://localhost:11434/api/generate');
curl_setopt_array($ch, [
    CURLOPT_POST           => true,
    CURLOPT_POSTFIELDS     => $ollamaPayload,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT        => 60,
    CURLOPT_CONNECTTIMEOUT => 5,
    CURLOPT_HTTPHEADER     => ['Content-Type: application/json'],
    CURLOPT_FAILONERROR    => false,
]);

$ollamaRaw  = curl_exec($ch);
$curlError  = curl_error($ch);
$httpStatus = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

// ---- Handle cURL Failures (Ollama offline) ----
if ($ollamaRaw === false || !empty($curlError)) {
    http_response_code(503);
    echo json_encode([
        'error' => 'AI temporarily offline. Please try again.',
        'debug' => $curlError,
    ]);
    exit;
}

// ---- Parse Ollama Response ----
$ollamaData = json_decode($ollamaRaw, true);

if (json_last_error() !== JSON_ERROR_NONE || !isset($ollamaData['response'])) {
    http_response_code(502);
    echo json_encode([
        'error' => 'AI temporarily offline. Please try again.',
        'debug' => 'Unexpected response from Ollama.',
    ]);
    exit;
}

$aiReply = trim($ollamaData['response']);

// Sanitize: remove any leftover "Assistant:" prefix Ollama might echo
$aiReply = preg_replace('/^(Assistant:|AI:)\s*/i', '', $aiReply);

// ---- Return Clean Response ----
http_response_code(200);
echo json_encode(['reply' => $aiReply], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
exit;
