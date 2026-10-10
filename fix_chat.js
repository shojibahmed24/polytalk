const fs = require('fs');

let content = fs.readFileSync('app/(app)/chat/[id].tsx', 'utf8');

// Use exact string replacement using indexOf and substring, or basic replace.
// Just find the index of the line.
let lines = content.split('\n');
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('text: \\AI provider is not connected yet')) {
    lines[i] = '        text: `AI provider is not connected yet. This is a local UI demonstration for PolyTalk. Real-time inference for ${languageName} will be added in upcoming phases.`,';
  }
}

fs.writeFileSync('app/(app)/chat/[id].tsx', lines.join('\n'), 'utf8');
