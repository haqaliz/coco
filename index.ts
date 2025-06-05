#! /usr/bin/env bun

import { readFile, writeFile } from 'fs/promises';
import { createWriteStream } from 'fs';
import OpenAI from 'openai';

// --- Defaults ---
const args = Bun.argv.slice(2);
const fileArg = args.find((a) => !a.startsWith('--'));
if (!fileArg) {
  console.error('❌ Please provide a path to the JSON file.');
  process.exit(1);
}

const getArg = (key: string, defaultValue: string) => {
  const arg = args.find((a) => a.startsWith(`--${key}=`));
  return arg ? arg.split('=')[1] : defaultValue;
};

const voice = getArg('voice', 'nova');
const model = getArg('model', 'gpt-4o-mini-tts');
const format = getArg('format', 'mp3');

const openai = new OpenAI({
  apiKey: Bun.env.OPENAI_API_KEY,
});

const instructions = `Affect: A gentle, curious narrator with a British accent, guiding a magical, child-friendly adventure through a fairy tale world.

Tone: Magical, warm, and inviting, creating a sense of wonder and excitement for young listeners.

Pacing: Steady and measured, with slight pauses to emphasize magical moments and maintain the storytelling flow.

Emotion: Wonder, curiosity, and a sense of adventure, with a lighthearted and positive vibe throughout.

Pronunciation: Clear and precise, with an emphasis on storytelling, ensuring the words are easy to follow and enchanting to listen to.`;

// --- Main ---
const run = async () => {
  const content = await readFile(fileArg, 'utf8');
  const sections = JSON.parse(content);

  if (!Array.isArray(sections)) {
    console.error('❌ JSON file must be an array of { name, content } objects.');
    process.exit(1);
  }

  for (const section of sections) {
    if (!section.name || !section.content) {
      console.warn(`⚠️ Skipping invalid section: ${JSON.stringify(section)}`);
      continue;
    }

    const response = await openai.audio.speech.create({
      model,
      voice,
      input: section.content,
      instructions,
      response_format: format,
    });

    const fileName = `${section.name}.${format}`;
    const stream = response.body;
    const fileStream = createWriteStream(fileName);
    const reader = stream.getReader();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      fileStream.write(value);
    }

    fileStream.end();
    console.log(`✅ Saved: ${fileName}`);
  }
};

run();
