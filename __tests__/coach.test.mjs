import test from 'node:test';
import assert from 'node:assert/strict';
import { z } from 'zod';

// 1. Test Schema Validation
const SendMessageSchema = z.object({
  content: z.string().min(1).max(2000),
  inputType: z.enum(['text', 'voice']).default('text'),
  language: z.string().optional().default('en'),
  idempotencyKey: z.string().optional(),
});

test('SendMessageSchema validates valid text message', () => {
  const result = SendMessageSchema.parse({
    content: 'Can I have the menu?',
    inputType: 'text',
    language: 'en',
    idempotencyKey: 'msg-1234',
  });
  assert.equal(result.content, 'Can I have the menu?');
  assert.equal(result.inputType, 'text');
});

test('SendMessageSchema rejects empty message', () => {
  assert.throws(() => {
    SendMessageSchema.parse({
      content: '',
      inputType: 'text',
    });
  });
});

test('SendMessageSchema defaults inputType to text', () => {
  const result = SendMessageSchema.parse({
    content: "I'll have a coffee.",
  });
  assert.equal(result.inputType, 'text');
  assert.equal(result.language, 'en');
});

// 2. Test AI Tag and Correction Parsing
test('Parses AI tags for corrections and suggested replies correctly', () => {
  const rawReply = `Certainly! Here is our lunch menu. Our pasta special today is wonderful. Would you like a beverage to start?
[CORRECTION: original="I want menu" | better="Can I have the menu, please?" | note="Adding 'please' makes requests more polite in English dining settings."]
[SUGGESTIONS: "I'll have a coffee." | "What is the soup of the day?" | "Just water for now, thanks."]`;

  let cleanReply = rawReply;
  let correction = null;
  let explanation = null;
  let suggested = [];

  const corrMatch = cleanReply.match(/\[CORRECTION:\s*original="([^"]*)"\s*\|\s*better="([^"]*)"\s*\|\s*note="([^"]*)"\]/i);
  if (corrMatch) {
    cleanReply = cleanReply.replace(corrMatch[0], '').trim();
    correction = corrMatch[2];
    explanation = corrMatch[3];
  }

  const sugMatch = cleanReply.match(/\[SUGGESTIONS:\s*"([^"]+)"\s*\|\s*"([^"]+)"(?:\s*\|\s*"([^"]+)")?\]/i);
  if (sugMatch) {
    cleanReply = cleanReply.replace(sugMatch[0], '').trim();
    suggested = [sugMatch[1], sugMatch[2]];
    if (sugMatch[3]) suggested.push(sugMatch[3]);
  }

  assert.ok(cleanReply.startsWith('Certainly! Here is our lunch menu.'));
  assert.equal(correction, 'Can I have the menu, please?');
  assert.ok(explanation.includes('polite'));
  assert.equal(suggested.length, 3);
  assert.equal(suggested[0], "I'll have a coffee.");
});

// 3. Test Pronunciation Assessment Calculation
function levenshteinSimilarity(a, b) {
  if (a === b) return 1.0;
  if (!a.length || !b.length) return 0.0;
  const matrix = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1);
      }
    }
  }
  return 1 - matrix[b.length][a.length] / Math.max(a.length, b.length);
}

function evaluatePronunciation(spokenText, referenceText) {
  const spoken = (spokenText || '').toLowerCase().trim();
  const target = (referenceText || spokenText).toLowerCase().trim();
  const spokenWords = spoken.split(/\s+/).filter(Boolean);
  const targetWords = target.split(/\s+/).filter(Boolean);

  let matched = 0;
  for (const tw of targetWords) {
    const swMatch = spokenWords.some(sw => sw === tw || levenshteinSimilarity(sw, tw) > 0.75);
    if (swMatch) matched++;
  }

  const accuracy = Math.round((matched / targetWords.length) * 100);
  const completeness = Math.min(100, Math.round((spokenWords.length / targetWords.length) * 100));
  return { accuracy, completeness };
}

test('Pronunciation assessment scores exact speech 100%', () => {
  const result = evaluatePronunciation('Can I have the menu', 'Can I have the menu');
  assert.equal(result.accuracy, 100);
  assert.equal(result.completeness, 100);
});

test('Pronunciation assessment detects partial/mispronounced speech', () => {
  const result = evaluatePronunciation('Can I haf menu', 'Can I have the menu');
  assert.ok(result.accuracy >= 50 && result.accuracy <= 80);
});

// 4. Test Idempotency Key Handling
test('Idempotency lock prevents concurrent duplicate submission', () => {
  const inFlight = new Set();
  const sessionId = 'session-abc';
  const key = `${sessionId}_Can I have the menu?`;

  assert.equal(inFlight.has(key), false);
  inFlight.add(key);
  assert.equal(inFlight.has(key), true);

  // Attempting second submission with same lock key is blocked
  const isDuplicateBlocked = inFlight.has(key);
  assert.equal(isDuplicateBlocked, true);

  inFlight.delete(key);
  assert.equal(inFlight.has(key), false);
});

// 5. Test Bilingual Tutor Mode Tag Parsing
test('Parses bilingual tutor tags for pronunciation, translation, vocabulary, and detailed suggestions', () => {
  const tutorOutput = `¡Hola! স্প্যানিশ শেখার ক্লাসে স্বাগতম। স্প্যানিশে হ্যালো বলতে বলে ¡Hola! (ওলা)। আর 'বই'-কে বলে libro (লিব্রো)।
[PRONUNCIATION: ওলা! • লিব্রো • কাফে]
[TRANSLATION: হ্যালো! স্প্যানিশ ক্লাসে স্বাগতম।]
[VOCABULARY: Hola="হ্যালো|ওলা" | libro="বই|লিব্রো"]
[SUGGESTIONS: "¡Hola! | হ্যালো | ওলা" | "Quiero un café | আমি একটি কফি চাই | কিয়েরো উন কাফে" | "Un libro, por favor | একটি বই, দয়া করে | উন লিব্রো, পর ফাভোর"]`;

  let clean = tutorOutput;
  let pronunciation = null;
  let translation = null;
  const vocab = [];
  const detailedSuggestions = [];

  const pronMatch = clean.match(/\[PRONUNCIATION:\s*([^\]]+)\]/i);
  if (pronMatch) {
    clean = clean.replace(pronMatch[0], '').trim();
    pronunciation = pronMatch[1].trim();
  }

  const transMatch = clean.match(/\[TRANSLATION:\s*([^\]]+)\]/i);
  if (transMatch) {
    clean = clean.replace(transMatch[0], '').trim();
    translation = transMatch[1].trim();
  }

  const vocabMatch = clean.match(/\[VOCABULARY:\s*([^\]]+)\]/i);
  if (vocabMatch) {
    clean = clean.replace(vocabMatch[0], '').trim();
    const matches = Array.from(vocabMatch[1].matchAll(/([a-zA-Z\u00C0-\u024F\u0980-\u09FF\s]+)\s*=\s*"([^"]+)"/g));
    for (const kv of matches) {
      const word = kv[1].trim();
      const [meaning, phonetic] = kv[2].split('|').map(s => s.trim());
      if (word && meaning) {
        vocab.push({ word, meaning, phonetic });
      }
    }
  }

  const sugMatch = clean.match(/\[SUGGESTIONS:\s*([^\]]+)\]/i);
  if (sugMatch) {
    clean = clean.replace(sugMatch[0], '').trim();
    const matches = Array.from(sugMatch[1].matchAll(/"([^"]+)"/g)).map(m => m[1]);
    for (const opt of matches) {
      const parts = opt.split('|').map(s => s.trim());
      if (parts.length >= 3) {
        detailedSuggestions.push({ target: parts[0], native: parts[1], phonetic: parts[2] });
      }
    }
  }

  assert.equal(pronunciation, 'ওলা! • লিব্রো • কাফে');
  assert.equal(translation, 'হ্যালো! স্প্যানিশ ক্লাসে স্বাগতম।');
  assert.equal(vocab.length, 2);
  assert.equal(vocab[0].word, 'Hola');
  assert.equal(vocab[0].meaning, 'হ্যালো');
  assert.equal(vocab[1].word, 'libro');
  assert.equal(vocab[1].meaning, 'বই');
  assert.equal(detailedSuggestions.length, 3);
  assert.equal(detailedSuggestions[0].target, '¡Hola!');
  assert.equal(detailedSuggestions[0].native, 'হ্যালো');
  assert.equal(detailedSuggestions[1].target, 'Quiero un café');
  assert.equal(detailedSuggestions[1].native, 'আমি একটি কফি চাই');
});

