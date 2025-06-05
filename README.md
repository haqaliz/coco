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

### Example `script.json`:

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

Each section in the JSON file is processed into its own audio file using the provided `name` as the filename.

---

## 🔗 Global CLI (`coco` command)

You can make `coco` globally available in your terminal for easier use.

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
coco ./script.json --voice=shimmer --format=wav
```

---

## 🧰 CLI Options

| Option       | Default             | Description                             |
|--------------|---------------------|-----------------------------------------|
| `--voice`    | `nova`              | Voice to use (`nova`, `shimmer`, etc.)  |
| `--model`    | `gpt-4o-mini-tts`   | Model to use                            |
| `--format`   | `mp3`               | Output audio format (`mp3`, `wav`, etc) |

---

## 📄 License

MIT – free to use, build on, and modify!

---

> Built with ❤️ using Bun + OpenAI + TypeScript
