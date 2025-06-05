#! /usr/bin/env bun

import { readFile } from 'fs/promises';
import { createWriteStream } from 'fs';
import OpenAI from 'openai';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

// 🧠 Setup CLI with yargs
const argv = await yargs(hideBin(Bun.argv))
  .usage('Usage: $0 <jsonFile> [options]')
  .example('$0 script.json --voice=shimmer --format=wav', 'Generate audio from sections')
  .demandCommand(1, 'You must provide a JSON file')
  .option('voice', {
    describe: 'Voice to use',
    type: 'string',
    default: 'nova',
  })
  .option('model', {
    describe: 'OpenAI model to use',
    type: 'string',
    default: 'gpt-4o-mini-tts',
  })
  .option('format', {
    describe: 'Output audio format (mp3, wav, pcm)',
    type: 'string',
    default: 'mp3',
  })
  .option('instructions', {
    describe: 'Instructions for voice style. Can be a string or a path to a .txt file.',
    type: 'string',
  })
  .help()
  .alias('h', 'help')
  .parse();

const [fileArg] = argv._;

const openai = new OpenAI({
  apiKey: Bun.env.OPENAI_API_KEY,
});

// 📄 Default instructions
const defaultInstructions = `Affect: A gentle, curious narrator with a British accent, guiding a magical, child-friendly adventure through a fairy tale world.

Tone: Magical, warm, and inviting, creating a sense of wonder and excitement for young listeners.

Pacing: Steady and measured, with slight pauses to emphasize magical moments and maintain the storytelling flow.

Emotion: Wonder, curiosity, and a sense of adventure, with a lighthearted and positive vibe throughout.

Pronunciation: Clear and precise, with an emphasis on storytelling, ensuring the words are easy to follow and enchanting to listen to.`;

// 🔍 Read instructions from string or file
const resolveInstructions = async (source: string | undefined): Promise<string> => {
  if (!source) return defaultInstructions;

  try {
    // Try loading as a file path
    const fileContents = await readFile(source, 'utf8');
    return fileContents;
  } catch {
    // If not a file, treat it as direct string input
    return source;
  }
};

const run = async () => {
  const instructions = await resolveInstructions(argv.instructions);

  console.log(`🎙️ Coco CLI – Generating audio from ${fileArg} using voice "${argv.voice}" (${argv.format})`);
  if (argv.instructions) {
    console.log(`📜 Custom instructions: ${argv.instructions.startsWith('.') ? 'from file' : 'inline'}\n`);
  }

  let content: string;
  try {
    content = await readFile(fileArg as string, 'utf8');
  } catch (err) {
    console.error(`❌ Failed to read file: ${fileArg}`);
    console.error(err);
    process.exit(1);
  }

  let sections: { name: string; content: string }[];
  try {
    sections = JSON.parse(content);
    if (!Array.isArray(sections)) throw new Error();
  } catch {
    console.error('❌ JSON must be an array of objects with `name` and `content`.');
    process.exit(1);
  }

  let successCount = 0;
  for (const [index, section] of sections.entries()) {
    if (!section.name || !section.content) {
      console.warn(`⚠️ Skipping invalid section at index ${index}: ${JSON.stringify(section)}`);
      continue;
    }

    console.log(`🎧 Generating "${section.name}.${argv.format}"...`);

    try {
      const response = await openai.audio.speech.create({
        model: argv.model,
        voice: argv.voice,
        input: section.content,
        instructions,
        response_format: argv.format,
      });

      const fileName = `${section.name}.${argv.format}`;
      const stream = response.body;
      const fileStream = createWriteStream(fileName);
      const reader = stream?.getReader();

      while (true) {
        const flow = await reader?.read();
        if (!flow || flow.done) break;
        fileStream.write(flow.value);
      }

      fileStream.end();
      console.log(`✅ Saved: ${fileName}\n`);
      successCount++;
    } catch (err) {
      console.error(`❌ Error generating audio for "${section.name}":`, err);
    }
  }

  console.log(`✨ Done! Successfully created ${successCount} file(s).\n`);
};

run();
