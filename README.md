# Coco 🎙️  
**Turn text sections into voice with GPT-4o-TTS using Bun**

Coco is a simple CLI tool that reads a JSON file and generates high-quality audio files for each section using OpenAI's text-to-speech (TTS) API.

---

## 📦 Installation

### 1. Install [Bun](https://bun.sh) if not already installed:
```bash
curl -fsSL https://bun.sh/install | bash
```

### 2. Clone this repo and install dependencies:
```bash
git clone https://github.com/your-user/coco.git
cd coco
bun install
```

---

## ⚙️ Setup

### 1. Add your OpenAI API key in a `.env` file:
Create a `.env` file in the root of the project:

```
OPENAI_API_KEY=sk-...
```

Coco automatically loads this with `Bun.env`.

---

## 🚀 Usage

Run the CLI by passing a JSON file of sections:

```bash
bun run index.ts ./script.json --voice=shimmer --format=wav
```

You can also install and use it globally (see [Global CLI](#-global-cli-coco-command)).

---

## 📄 Input File Format

Provide a `.json` file containing an array of objects with `name` and `content`:

```json
[
  {
    "name": "intro",
    "content": "Welcome to my YouTube video!"
  },
  {
    "name": "outro",
    "content": "Thanks for watching!"
  }
]
```

### Output:
This will generate:
- `intro.wav`
- `outro.wav`

Each section is converted into a separate audio file using the specified format and voice.

---

## ✍️ Custom Instructions

You can provide custom voice instructions in two ways:

### ✅ As a plain string:
```bash
coco script.json --instructions="Make it sound dramatic and slow."
```

### ✅ From a `.txt` file:
```bash
coco script.json --instructions=instructions.txt
```

If no `--instructions` is given, a warm, magical storytelling default will be used.

---

## 🔗 Global CLI (`coco` command)

You can make `coco` globally available in your terminal.

### 1. Add a shebang to the top of `index.ts`:

```ts
#!/usr/bin/env bun
```

### 2. Make it executable:

```bash
chmod +x index.ts
```

### 3. Rename and symlink it globally:

```bash
mv index.ts coco
ln -s $PWD/coco ~/.bun/bin/coco
```

> Ensure `~/.bun/bin` is in your `PATH`. Add this to your `.bashrc`, `.zshrc`, or `.profile` if needed:
> ```bash
> export PATH="$HOME/.bun/bin:$PATH"
> ```

Now you can run it anywhere like:

```bash
coco script.json --voice=shimmer --format=mp3
```

---

## 🧰 CLI Options

| Option           | Type     | Default             | Description                                                                 |
|------------------|----------|---------------------|-----------------------------------------------------------------------------|
| `<jsonFile>`     | `string` | *(required)*        | Path to JSON file containing section objects (`name` + `content`)           |
| `--voice`        | `string` | `"nova"`            | Voice style (e.g., `nova`, `shimmer`, `echo`, etc.)                         |
| `--model`        | `string` | `"gpt-4o-mini-tts"` | OpenAI model to use for speech generation                                  |
| `--format`       | `string` | `"mp3"`             | Audio output format (`mp3`, `wav`, or `pcm`)                                |
| `--instructions` | `string` | *(optional)*        | Text style instructions (inline string or path to `.txt` file)             |

Use `--help` to view available options anytime:

```bash
coco --help
```

---

## 🧪 Example

```bash
coco script.json \
  --voice=shimmer \
  --model=gpt-4o-mini-tts \
  --format=wav \
  --instructions=instructions.txt
```

---

## 📄 License

MIT – free to use, build on, and modify!

---

> Built with ❤️ using Bun + OpenAI + TypeScript
