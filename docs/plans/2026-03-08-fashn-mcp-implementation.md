# fashn-mcp Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build an MCP server wrapping the FASHN AI API so Claude Code can do virtual try-on, model creation, model swapping, background changes, and product photography through tool calls.

**Architecture:** Stdio MCP server with 8 tools. Each tool calls the FASHN TypeScript SDK's `subscribe()` method (with raw REST fallback), downloads output images locally, and returns file paths. An image manager handles base64 conversion for local files and auto-downloads all outputs since FASHN CDN URLs expire in 72 hours.

**Tech Stack:** TypeScript, `@modelcontextprotocol/sdk`, `fashn` (official SDK), `zod`, `sharp` (image resizing), Node.js 20+

---

### Task 1: Project Scaffold

**Files:**
- Create: `fashn-mcp/package.json`
- Create: `fashn-mcp/tsconfig.json`
- Create: `fashn-mcp/src/index.ts` (empty entry point)

**Step 1: Create project directory and initialize**

```bash
cd /Users/curtisvaughan/claude-code-vault/Projects/POSTED
mkdir -p fashn-mcp/src/tools fashn-mcp/src/lib fashn-mcp/src/types
cd fashn-mcp
```

**Step 2: Create package.json**

```json
{
  "name": "fashn-mcp",
  "version": "0.1.0",
  "description": "MCP server wrapping the FASHN AI API for virtual try-on and fashion photography",
  "type": "module",
  "main": "dist/index.js",
  "bin": {
    "fashn-mcp": "dist/index.js"
  },
  "scripts": {
    "build": "tsc",
    "dev": "tsx src/index.ts",
    "start": "node dist/index.js",
    "test": "tsx --test src/**/*.test.ts"
  },
  "keywords": ["mcp", "fashn", "virtual-try-on", "fashion", "ai"],
  "license": "MIT"
}
```

**Step 3: Create tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "outDir": "dist",
    "rootDir": "src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "declaration": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}
```

**Step 4: Install dependencies**

```bash
npm install @modelcontextprotocol/sdk zod fashn sharp
npm install -D typescript tsx @types/node
```

**Step 5: Create empty entry point**

`fashn-mcp/src/index.ts`:
```typescript
#!/usr/bin/env node
console.error('fashn-mcp: starting...');
```

**Step 6: Verify build**

```bash
npx tsc --noEmit
```
Expected: No errors.

**Step 7: Commit**

```bash
git add -A
git commit -m "feat: scaffold fashn-mcp project"
```

---

### Task 2: Image Manager

**Files:**
- Create: `fashn-mcp/src/lib/image-manager.ts`
- Create: `fashn-mcp/src/lib/image-manager.test.ts`

This is the utility layer that all tools depend on. It handles:
1. Local file path → base64 data URI (with resize if >5MB)
2. Download FASHN CDN output → organized local folders
3. Descriptive auto-naming

**Step 1: Write the tests**

`fashn-mcp/src/lib/image-manager.test.ts`:
```typescript
import { test, describe } from 'node:test';
import assert from 'node:assert';
import { resolveImageInput, getOutputDir, generateFilename } from './image-manager.js';
import { existsSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';

describe('image-manager', () => {
  test('resolveImageInput returns URL as-is', async () => {
    const result = await resolveImageInput('https://example.com/image.jpg');
    assert.strictEqual(result, 'https://example.com/image.jpg');
  });

  test('resolveImageInput converts local file to base64 data URI', async () => {
    // Create a tiny test image (1x1 red pixel PNG)
    const testDir = join(tmpdir(), 'fashn-mcp-test');
    mkdirSync(testDir, { recursive: true });
    const testFile = join(testDir, 'test.png');
    // Minimal valid PNG (1x1 red pixel)
    const pngBuffer = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==',
      'base64'
    );
    writeFileSync(testFile, pngBuffer);

    const result = await resolveImageInput(testFile);
    assert.ok(result.startsWith('data:image/png;base64,'));
  });

  test('resolveImageInput throws for missing file', async () => {
    await assert.rejects(
      () => resolveImageInput('/nonexistent/file.png'),
      { message: /not found/i }
    );
  });

  test('getOutputDir creates nested directory', () => {
    const dir = getOutputDir('tryon');
    assert.ok(dir.includes('fashn-images'));
    assert.ok(dir.endsWith('tryon'));
  });

  test('generateFilename creates descriptive name', () => {
    const name = generateFilename('tryon', 'sandys-tee');
    assert.ok(name.includes('tryon'));
    assert.ok(name.includes('sandys-tee'));
    assert.ok(name.endsWith('.png'));
    // Should contain date
    assert.ok(name.includes('2026'));
  });
});
```

**Step 2: Run tests to verify they fail**

```bash
cd /Users/curtisvaughan/claude-code-vault/Projects/POSTED/fashn-mcp
npx tsx --test src/lib/image-manager.test.ts
```
Expected: FAIL — module not found.

**Step 3: Implement image-manager**

`fashn-mcp/src/lib/image-manager.ts`:
```typescript
import { readFileSync, existsSync, mkdirSync, writeFileSync, statSync } from 'fs';
import { join, extname, basename } from 'path';
import { homedir } from 'os';
import { randomBytes } from 'crypto';

const BASE_OUTPUT_DIR = join(homedir(), 'Documents', 'fashn-images');
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

/**
 * Resolve an image input to a format FASHN accepts.
 * - URLs pass through unchanged.
 * - Local file paths are converted to base64 data URIs.
 * - Files >5MB are resized down before conversion.
 */
export async function resolveImageInput(input: string): Promise<string> {
  // If it looks like a URL or data URI, pass through
  if (input.startsWith('http://') || input.startsWith('https://') || input.startsWith('data:')) {
    return input;
  }

  // Local file path
  if (!existsSync(input)) {
    throw new Error(`Image file not found: ${input}`);
  }

  const stat = statSync(input);
  let buffer = readFileSync(input);

  // Resize large files to reduce bandwidth (FASHN output is 576x864 anyway)
  if (stat.size > MAX_FILE_SIZE_BYTES) {
    try {
      const sharp = (await import('sharp')).default;
      buffer = await sharp(buffer)
        .resize(1024, 1024, { fit: 'inside', withoutEnlargement: true })
        .png()
        .toBuffer();
    } catch {
      // If sharp fails, send original — FASHN may still accept it
    }
  }

  const ext = extname(input).toLowerCase();
  const mimeType = ext === '.png' ? 'image/png'
    : ext === '.webp' ? 'image/webp'
    : 'image/jpeg';

  return `data:${mimeType};base64,${buffer.toString('base64')}`;
}

/**
 * Get the output directory for a given tool type. Creates it if needed.
 */
export function getOutputDir(toolType: string): string {
  const dir = join(BASE_OUTPUT_DIR, toolType);
  mkdirSync(dir, { recursive: true });
  return dir;
}

/**
 * Generate a descriptive filename for an output image.
 */
export function generateFilename(toolType: string, label?: string, ext: string = '.png'): string {
  const date = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const hash = randomBytes(3).toString('hex'); // 6 char random suffix
  const parts = [toolType];
  if (label) parts.push(label);
  parts.push(date, hash);
  return parts.join('-') + ext;
}

/**
 * Download an image from a URL and save it locally.
 * Returns the local file path.
 */
export async function downloadOutput(
  url: string,
  toolType: string,
  label?: string,
  outputPath?: string,
): Promise<string> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to download image: ${res.status} ${res.statusText}`);
  }

  const buffer = Buffer.from(await res.arrayBuffer());

  const finalPath = outputPath || join(getOutputDir(toolType), generateFilename(toolType, label));
  mkdirSync(join(finalPath, '..'), { recursive: true });
  writeFileSync(finalPath, buffer);

  return finalPath;
}

/**
 * Save a base64-encoded image to disk.
 * Returns the local file path.
 */
export function saveBase64Output(
  base64Data: string,
  toolType: string,
  label?: string,
  outputPath?: string,
): string {
  // Strip data URI prefix if present
  const raw = base64Data.replace(/^data:image\/\w+;base64,/, '');
  const buffer = Buffer.from(raw, 'base64');

  const finalPath = outputPath || join(getOutputDir(toolType), generateFilename(toolType, label));
  mkdirSync(join(finalPath, '..'), { recursive: true });
  writeFileSync(finalPath, buffer);

  return finalPath;
}
```

**Step 4: Run tests**

```bash
npx tsx --test src/lib/image-manager.test.ts
```
Expected: All 5 tests PASS.

**Step 5: Commit**

```bash
git add src/lib/image-manager.ts src/lib/image-manager.test.ts
git commit -m "feat: add image manager with base64 conversion, resize, and download"
```

---

### Task 3: FASHN Client Wrapper

**Files:**
- Create: `fashn-mcp/src/lib/fashn-client.ts`
- Create: `fashn-mcp/src/lib/fashn-client.test.ts`

The client wrapper tries the FASHN SDK first, falls back to raw REST if the SDK doesn't support a model_name.

**Step 1: Write the test**

`fashn-mcp/src/lib/fashn-client.test.ts`:
```typescript
import { test, describe } from 'node:test';
import assert from 'node:assert';
import { createFashnClient, FashnError } from './fashn-client.js';

describe('fashn-client', () => {
  test('createFashnClient throws without API key', () => {
    const original = process.env.FASHN_API_KEY;
    delete process.env.FASHN_API_KEY;
    assert.throws(() => createFashnClient(), { message: /FASHN_API_KEY/i });
    if (original) process.env.FASHN_API_KEY = original;
  });

  test('createFashnClient returns client with run and status methods', () => {
    process.env.FASHN_API_KEY = 'test-key';
    const client = createFashnClient();
    assert.ok(typeof client.run === 'function');
    assert.ok(typeof client.status === 'function');
    assert.ok(typeof client.credits === 'function');
  });

  test('FashnError includes status and prediction ID', () => {
    const err = new FashnError('failed', 'pred-123', 'Something went wrong');
    assert.strictEqual(err.predictionId, 'pred-123');
    assert.strictEqual(err.fashnStatus, 'failed');
    assert.ok(err.message.includes('Something went wrong'));
  });
});
```

**Step 2: Run tests to verify they fail**

```bash
npx tsx --test src/lib/fashn-client.test.ts
```
Expected: FAIL — module not found.

**Step 3: Implement fashn-client**

`fashn-mcp/src/lib/fashn-client.ts`:
```typescript
import Fashn from 'fashn';

const FASHN_API_BASE = 'https://api.fashn.ai/v1';
const DEFAULT_TIMEOUT = 120_000; // 2 minutes
const POLL_INTERVAL = 2_000; // 2 seconds

export class FashnError extends Error {
  constructor(
    public fashnStatus: string,
    public predictionId: string,
    message: string,
  ) {
    super(`FASHN prediction ${fashnStatus} (${predictionId}): ${message}`);
    this.name = 'FashnError';
  }
}

interface FashnResult {
  id: string;
  status: string;
  output: string[];
  creditsUsed?: number;
  error?: { message: string } | null;
}

interface FashnClient {
  run: (modelName: string, inputs: Record<string, any>, timeout?: number) => Promise<FashnResult>;
  status: (predictionId: string) => Promise<FashnResult>;
  credits: () => Promise<{ total: number; subscription: number; on_demand: number }>;
}

export function createFashnClient(): FashnClient {
  const apiKey = process.env.FASHN_API_KEY;
  if (!apiKey) {
    throw new Error('FASHN_API_KEY environment variable is required');
  }

  const sdk = new Fashn({ apiKey });

  async function runWithSDK(modelName: string, inputs: Record<string, any>, timeout: number): Promise<FashnResult> {
    try {
      const response = await sdk.predictions.subscribe({
        model_name: modelName,
        inputs,
      });

      if (response.status !== 'completed') {
        throw new FashnError(
          response.status,
          response.id,
          response.error?.message || 'Unknown error',
        );
      }

      return {
        id: response.id,
        status: response.status,
        output: Array.isArray(response.output) ? response.output : [response.output].filter(Boolean),
        creditsUsed: response.creditsUsed,
        error: response.error,
      };
    } catch (err: any) {
      // If SDK doesn't support this model, fall back to raw REST
      if (err?.message?.includes('model') || err?.status === 400 || err?.status === 422) {
        return runWithREST(modelName, inputs, timeout);
      }
      throw err;
    }
  }

  async function runWithREST(modelName: string, inputs: Record<string, any>, timeout: number): Promise<FashnResult> {
    // Submit prediction
    const submitRes = await fetch(`${FASHN_API_BASE}/run`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ model_name: modelName, inputs }),
    });

    if (!submitRes.ok) {
      const body = await submitRes.text();
      throw new Error(`FASHN API error ${submitRes.status}: ${body}`);
    }

    const submitData = await submitRes.json();
    const predictionId = submitData.id;

    // Poll for completion
    const start = Date.now();
    while (Date.now() - start < timeout) {
      await new Promise(r => setTimeout(r, POLL_INTERVAL));

      const pollRes = await fetch(`${FASHN_API_BASE}/status/${predictionId}`, {
        headers: { Authorization: `Bearer ${apiKey}` },
      });

      if (!pollRes.ok) {
        throw new Error(`FASHN poll error ${pollRes.status}`);
      }

      const data = await pollRes.json();

      if (data.status === 'completed') {
        return {
          id: data.id,
          status: data.status,
          output: Array.isArray(data.output) ? data.output : [data.output].filter(Boolean),
          creditsUsed: data.creditsUsed,
          error: null,
        };
      }

      if (data.status === 'failed' || data.status === 'canceled' || data.status === 'time_out') {
        throw new FashnError(data.status, predictionId, data.error?.message || 'Unknown error');
      }
    }

    throw new FashnError('timeout', predictionId, `Timed out after ${timeout / 1000}s`);
  }

  async function run(modelName: string, inputs: Record<string, any>, timeout: number = DEFAULT_TIMEOUT): Promise<FashnResult> {
    return runWithSDK(modelName, inputs, timeout);
  }

  async function status(predictionId: string): Promise<FashnResult> {
    // Try SDK first
    try {
      const data = await sdk.predictions.status(predictionId);
      return {
        id: data.id,
        status: data.status,
        output: Array.isArray(data.output) ? data.output : [data.output].filter(Boolean),
        creditsUsed: data.creditsUsed,
        error: data.error,
      };
    } catch {
      // Fall back to REST
      const res = await fetch(`${FASHN_API_BASE}/status/${predictionId}`, {
        headers: { Authorization: `Bearer ${apiKey}` },
      });
      if (!res.ok) throw new Error(`FASHN status error ${res.status}`);
      const data = await res.json();
      return {
        id: data.id,
        status: data.status,
        output: Array.isArray(data.output) ? data.output : [data.output].filter(Boolean),
        creditsUsed: data.creditsUsed,
        error: data.error,
      };
    }
  }

  async function credits(): Promise<{ total: number; subscription: number; on_demand: number }> {
    const res = await fetch(`${FASHN_API_BASE}/credits`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    if (!res.ok) throw new Error(`FASHN credits error ${res.status}`);
    const data = await res.json();
    return data.credits;
  }

  return { run, status, credits };
}
```

**Step 4: Run tests**

```bash
npx tsx --test src/lib/fashn-client.test.ts
```
Expected: All 3 tests PASS.

**Step 5: Commit**

```bash
git add src/lib/fashn-client.ts src/lib/fashn-client.test.ts
git commit -m "feat: add FASHN client wrapper with SDK + REST fallback"
```

---

### Task 4: MCP Server Entry Point + Credits Tool + Status Tool

**Files:**
- Create: `fashn-mcp/src/tools/credits.ts`
- Create: `fashn-mcp/src/tools/status.ts`
- Modify: `fashn-mcp/src/index.ts`

These are the simplest tools — prove the MCP wiring works before adding image tools.

**Step 1: Implement credits tool**

`fashn-mcp/src/tools/credits.ts`:
```typescript
import { z } from 'zod';
import { createFashnClient } from '../lib/fashn-client.js';

export const creditsTool = {
  name: 'fashn_credits',
  description: 'Check your remaining FASHN API credit balance. Returns total, subscription, and on-demand credits.',
  inputSchema: z.object({}),
  async handler() {
    const client = createFashnClient();
    const credits = await client.credits();
    return {
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify(credits, null, 2),
        },
      ],
    };
  },
};
```

**Step 2: Implement status tool**

`fashn-mcp/src/tools/status.ts`:
```typescript
import { z } from 'zod';
import { createFashnClient } from '../lib/fashn-client.js';

export const statusTool = {
  name: 'fashn_status',
  description: 'Check the status of a FASHN prediction by ID. Useful for debugging when a generation hangs or fails.',
  inputSchema: z.object({
    prediction_id: z.string().describe('The prediction ID to check status for'),
  }),
  async handler({ prediction_id }: { prediction_id: string }) {
    const client = createFashnClient();
    const result = await client.status(prediction_id);
    return {
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify({
            id: result.id,
            status: result.status,
            output: result.output,
            creditsUsed: result.creditsUsed,
            error: result.error,
          }, null, 2),
        },
      ],
    };
  },
};
```

**Step 3: Build MCP server entry point**

`fashn-mcp/src/index.ts`:
```typescript
#!/usr/bin/env node

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { creditsTool } from './tools/credits.js';
import { statusTool } from './tools/status.js';

const server = new McpServer({
  name: 'fashn-mcp',
  version: '0.1.0',
});

// Register tools
server.tool(
  creditsTool.name,
  creditsTool.description,
  creditsTool.inputSchema.shape,
  creditsTool.handler,
);

server.tool(
  statusTool.name,
  statusTool.description,
  statusTool.inputSchema.shape,
  statusTool.handler,
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('fashn-mcp server started');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
```

**Step 4: Verify build compiles**

```bash
npx tsc --noEmit
```
Expected: No errors. (Fix any type issues that arise from the MCP SDK API — the registration pattern may need adjustment based on the exact SDK version.)

**Step 5: Test the MCP server starts**

```bash
echo '{"jsonrpc":"2.0","method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"1.0.0"}},"id":1}' | FASHN_API_KEY=test npx tsx src/index.ts 2>/dev/null | head -1
```
Expected: A JSON-RPC response with server capabilities.

**Step 6: Commit**

```bash
git add src/index.ts src/tools/credits.ts src/tools/status.ts
git commit -m "feat: MCP server with fashn_credits and fashn_status tools"
```

---

### Task 5: Try-On Tool

**Files:**
- Create: `fashn-mcp/src/tools/tryon.ts`
- Modify: `fashn-mcp/src/index.ts` (register tool)

This is the star tool. Takes a garment image + model image, returns photorealistic try-on.

**Step 1: Implement tryon tool**

`fashn-mcp/src/tools/tryon.ts`:
```typescript
import { z } from 'zod';
import { createFashnClient } from '../lib/fashn-client.js';
import { resolveImageInput, downloadOutput } from '../lib/image-manager.js';

export const tryonTool = {
  name: 'fashn_tryon',
  description: 'Put a garment onto a model photo. Upload a garment image (flat lay, ghost mannequin, or on-model) and a model image — returns a photorealistic image of the model wearing the garment. Cost: 1 credit per image.',
  inputSchema: z.object({
    model_image: z.string().describe('URL or local file path to the model/person photo'),
    garment_image: z.string().describe('URL or local file path to the garment photo (flat lay, ghost mannequin, or on-model)'),
    category: z.enum(['auto', 'tops', 'bottoms', 'one-pieces']).default('auto').describe('Garment category. Default: auto-detect.'),
    garment_photo_type: z.enum(['auto', 'flat-lay', 'model']).default('auto').describe('Type of garment photo. Default: auto-detect.'),
    mode: z.enum(['performance', 'balanced', 'quality']).default('quality').describe('Speed vs quality tradeoff. Default: quality.'),
    num_samples: z.number().min(1).max(4).default(1).describe('Number of images to generate (1-4). Default: 1.'),
    seed: z.number().optional().describe('Seed for reproducible results'),
    output_path: z.string().optional().describe('Custom output file path. Default: ~/Documents/fashn-images/tryon/'),
    label: z.string().optional().describe('Descriptive label for the output filename (e.g. "sandys-tee-model01")'),
  }),
  async handler(args: {
    model_image: string;
    garment_image: string;
    category?: string;
    garment_photo_type?: string;
    mode?: string;
    num_samples?: number;
    seed?: number;
    output_path?: string;
    label?: string;
  }) {
    const client = createFashnClient();

    // Resolve local files to base64
    const modelImage = await resolveImageInput(args.model_image);
    const garmentImage = await resolveImageInput(args.garment_image);

    const inputs: Record<string, any> = {
      model_image: modelImage,
      garment_image: garmentImage,
      category: args.category || 'auto',
      garment_photo_type: args.garment_photo_type || 'auto',
      mode: args.mode || 'quality',
      num_samples: args.num_samples || 1,
    };
    if (args.seed !== undefined) inputs.seed = args.seed;

    const result = await client.run('tryon-v1.6', inputs);

    // Download all output images
    const savedPaths: string[] = [];
    for (let i = 0; i < result.output.length; i++) {
      const outputUrl = result.output[i];
      const suffix = result.output.length > 1 ? `${args.label || 'result'}-${i + 1}` : args.label;
      const path = await downloadOutput(outputUrl, 'tryon', suffix, args.output_path);
      savedPaths.push(path);
    }

    return {
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify({
            prediction_id: result.id,
            credits_used: result.creditsUsed,
            images: savedPaths,
          }, null, 2),
        },
      ],
    };
  },
};
```

**Step 2: Register in index.ts**

Add to `fashn-mcp/src/index.ts`:
```typescript
import { tryonTool } from './tools/tryon.js';
```
And register:
```typescript
server.tool(
  tryonTool.name,
  tryonTool.description,
  tryonTool.inputSchema.shape,
  tryonTool.handler,
);
```

**Step 3: Verify build**

```bash
npx tsc --noEmit
```
Expected: No errors.

**Step 4: Commit**

```bash
git add src/tools/tryon.ts src/index.ts
git commit -m "feat: add fashn_tryon tool"
```

---

### Task 6: Product-to-Model Tool

**Files:**
- Create: `fashn-mcp/src/tools/product-to-model.ts`
- Modify: `fashn-mcp/src/index.ts` (register tool)

Transforms a flat lay / ghost mannequin into a realistic on-model photo.

**Step 1: Implement tool**

`fashn-mcp/src/tools/product-to-model.ts`:
```typescript
import { z } from 'zod';
import { createFashnClient } from '../lib/fashn-client.js';
import { resolveImageInput, downloadOutput } from '../lib/image-manager.js';

export const productToModelTool = {
  name: 'fashn_product_to_model',
  description: 'Transform a product-only image (flat lay or ghost mannequin) into a realistic photo of someone wearing it. Cost: 1 credit per image.',
  inputSchema: z.object({
    product_image: z.string().describe('URL or local file path to the product image'),
    model_image: z.string().optional().describe('Optional: specific model photo for try-on mode (incompatible with prompt/face_reference)'),
    prompt: z.string().optional().describe('Text description for the generated model and scene (e.g. "Young local guy, Kaka\'ako, golden hour")'),
    face_reference: z.string().optional().describe('Optional: face photo to guide the generated person\'s appearance'),
    background_reference: z.string().optional().describe('Optional: background image for consistent backdrop'),
    aspect_ratio: z.enum(['1:1', '3:4', '4:3', '9:16', '16:9', '2:3', '3:2', '4:5', '5:4']).optional().describe('Output aspect ratio'),
    num_images: z.number().min(1).max(4).default(1).describe('Number of images (1-4). Default: 1.'),
    seed: z.number().optional().describe('Seed for reproducible results'),
    output_path: z.string().optional().describe('Custom output file path'),
    label: z.string().optional().describe('Descriptive label for filename'),
  }),
  async handler(args: any) {
    const client = createFashnClient();

    const inputs: Record<string, any> = {
      product_image: await resolveImageInput(args.product_image),
      num_images: args.num_images || 1,
    };
    if (args.model_image) inputs.model_image = await resolveImageInput(args.model_image);
    if (args.prompt) inputs.prompt = args.prompt;
    if (args.face_reference) inputs.face_reference = await resolveImageInput(args.face_reference);
    if (args.background_reference) inputs.background_reference = await resolveImageInput(args.background_reference);
    if (args.aspect_ratio) inputs.aspect_ratio = args.aspect_ratio;
    if (args.seed !== undefined) inputs.seed = args.seed;

    const result = await client.run('product-to-model', inputs);

    const savedPaths: string[] = [];
    for (let i = 0; i < result.output.length; i++) {
      const suffix = result.output.length > 1 ? `${args.label || 'result'}-${i + 1}` : args.label;
      const path = await downloadOutput(result.output[i], 'product-to-model', suffix, args.output_path);
      savedPaths.push(path);
    }

    return {
      content: [{
        type: 'text' as const,
        text: JSON.stringify({ prediction_id: result.id, credits_used: result.creditsUsed, images: savedPaths }, null, 2),
      }],
    };
  },
};
```

**Step 2: Register in index.ts** (import + server.tool call, same pattern as tryon)

**Step 3: Verify build, commit**

```bash
npx tsc --noEmit
git add src/tools/product-to-model.ts src/index.ts
git commit -m "feat: add fashn_product_to_model tool"
```

---

### Task 7: Model Create Tool

**Files:**
- Create: `fashn-mcp/src/tools/model-create.ts`
- Modify: `fashn-mcp/src/index.ts`

Generate AI fashion models from text prompts.

**Step 1: Implement tool**

`fashn-mcp/src/tools/model-create.ts`:
```typescript
import { z } from 'zod';
import { createFashnClient } from '../lib/fashn-client.js';
import { resolveImageInput, downloadOutput } from '../lib/image-manager.js';

export const modelCreateTool = {
  name: 'fashn_model_create',
  description: 'Generate a realistic AI fashion model from a text description. Use for creating diverse model roster without photoshoots. Cost: 1 credit per image (4 with face_reference).',
  inputSchema: z.object({
    prompt: z.string().describe('Description of the model (e.g. "Young local Hawaiian guy, early 20s, relaxed confident expression, standing, golden hour, streetwear lookbook")'),
    image_reference: z.string().optional().describe('Optional: reference image to guide composition and pose'),
    face_reference: z.string().optional().describe('Optional: portrait to lock in specific identity (1k resolution only, 4 credits/image)'),
    aspect_ratio: z.enum(['1:1', '3:4', '4:3', '9:16', '16:9', '2:3', '3:2', '4:5', '5:4', '21:9']).default('3:4').describe('Output aspect ratio. Default: 3:4 (portrait).'),
    num_images: z.number().min(1).max(4).default(1).describe('Number of images (1-4). Default: 1.'),
    seed: z.number().optional().describe('Seed for reproducible results'),
    output_path: z.string().optional().describe('Custom output file path'),
    label: z.string().optional().describe('Descriptive label for filename (e.g. "local-guy-kakaako")'),
  }),
  async handler(args: any) {
    const client = createFashnClient();

    const inputs: Record<string, any> = {
      prompt: args.prompt,
      aspect_ratio: args.aspect_ratio || '3:4',
      num_images: args.num_images || 1,
    };
    if (args.image_reference) inputs.image_reference = await resolveImageInput(args.image_reference);
    if (args.face_reference) inputs.face_reference = await resolveImageInput(args.face_reference);
    if (args.seed !== undefined) inputs.seed = args.seed;

    const result = await client.run('model-create', inputs);

    const savedPaths: string[] = [];
    for (let i = 0; i < result.output.length; i++) {
      const suffix = result.output.length > 1 ? `${args.label || 'model'}-${i + 1}` : (args.label || 'model');
      const path = await downloadOutput(result.output[i], 'models', suffix, args.output_path);
      savedPaths.push(path);
    }

    return {
      content: [{
        type: 'text' as const,
        text: JSON.stringify({ prediction_id: result.id, credits_used: result.creditsUsed, images: savedPaths }, null, 2),
      }],
    };
  },
};
```

**Step 2: Register in index.ts, verify build, commit**

```bash
npx tsc --noEmit
git add src/tools/model-create.ts src/index.ts
git commit -m "feat: add fashn_model_create tool"
```

---

### Task 8: Model Swap Tool

**Files:**
- Create: `fashn-mcp/src/tools/model-swap.ts`
- Modify: `fashn-mcp/src/index.ts`

Replace the model in a photo while keeping garment + background.

**Step 1: Implement tool**

`fashn-mcp/src/tools/model-swap.ts`:
```typescript
import { z } from 'zod';
import { createFashnClient } from '../lib/fashn-client.js';
import { resolveImageInput, downloadOutput } from '../lib/image-manager.js';

export const modelSwapTool = {
  name: 'fashn_model_swap',
  description: 'Replace the model in an existing fashion photo while keeping the garment, pose, and background. Cost: 1 credit per image.',
  inputSchema: z.object({
    model_image: z.string().describe('Source fashion photo — the clothing and scene will be preserved'),
    prompt: z.string().optional().describe('Text guidance for the new model identity. If omitted, system generates automatically.'),
    face_reference: z.string().optional().describe('Optional: reference face photo to guide identity'),
    face_reference_mode: z.enum(['match_base', 'match_reference']).default('match_reference').describe('match_base preserves original pose; match_reference favors reference. Default: match_reference.'),
    num_images: z.number().min(1).max(4).default(1).describe('Number of images (1-4). Default: 1.'),
    seed: z.number().optional().describe('Seed for reproducible results'),
    output_path: z.string().optional().describe('Custom output file path'),
    label: z.string().optional().describe('Descriptive label for filename'),
  }),
  async handler(args: any) {
    const client = createFashnClient();

    const inputs: Record<string, any> = {
      model_image: await resolveImageInput(args.model_image),
      num_images: args.num_images || 1,
    };
    if (args.prompt) inputs.prompt = args.prompt;
    if (args.face_reference) inputs.face_reference = await resolveImageInput(args.face_reference);
    if (args.face_reference_mode) inputs.face_reference_mode = args.face_reference_mode;
    if (args.seed !== undefined) inputs.seed = args.seed;

    const result = await client.run('model-swap', inputs);

    const savedPaths: string[] = [];
    for (let i = 0; i < result.output.length; i++) {
      const suffix = result.output.length > 1 ? `${args.label || 'swap'}-${i + 1}` : (args.label || 'swap');
      const path = await downloadOutput(result.output[i], 'swaps', suffix, args.output_path);
      savedPaths.push(path);
    }

    return {
      content: [{
        type: 'text' as const,
        text: JSON.stringify({ prediction_id: result.id, credits_used: result.creditsUsed, images: savedPaths }, null, 2),
      }],
    };
  },
};
```

**Step 2: Register in index.ts, verify build, commit**

```bash
npx tsc --noEmit
git add src/tools/model-swap.ts src/index.ts
git commit -m "feat: add fashn_model_swap tool"
```

---

### Task 9: Background Change Tool

**Files:**
- Create: `fashn-mcp/src/tools/background-change.ts`
- Modify: `fashn-mcp/src/index.ts`

**Important:** There is no dedicated `background-change` model in the FASHN API. This tool is a convenience wrapper around the `edit` endpoint with background-focused defaults.

**Step 1: Implement tool**

`fashn-mcp/src/tools/background-change.ts`:
```typescript
import { z } from 'zod';
import { createFashnClient } from '../lib/fashn-client.js';
import { resolveImageInput, downloadOutput } from '../lib/image-manager.js';

export const backgroundChangeTool = {
  name: 'fashn_background_change',
  description: 'Change the background of a fashion photo while preserving the model and garment. Uses the FASHN edit endpoint with background-focused prompting. Cost: 1 credit.',
  inputSchema: z.object({
    image: z.string().describe('URL or local file path to the source image'),
    prompt: z.string().describe('Description of the new background (e.g. "Kaka\'ako street with murals and palm trees, golden hour light")'),
    image_context: z.string().optional().describe('Optional: reference image for the target background'),
    resolution: z.enum(['1k', '4k']).default('1k').describe('Output resolution. Default: 1k.'),
    seed: z.number().optional().describe('Seed for reproducible results'),
    output_path: z.string().optional().describe('Custom output file path'),
    label: z.string().optional().describe('Descriptive label for filename'),
  }),
  async handler(args: any) {
    const client = createFashnClient();

    const inputs: Record<string, any> = {
      image: await resolveImageInput(args.image),
      prompt: `Change the background to: ${args.prompt}. Keep the person and clothing exactly as they are.`,
      resolution: args.resolution || '1k',
    };
    if (args.image_context) inputs.image_context = await resolveImageInput(args.image_context);
    if (args.seed !== undefined) inputs.seed = args.seed;

    const result = await client.run('edit', inputs);

    const savedPaths: string[] = [];
    for (const url of result.output) {
      const path = await downloadOutput(url, 'backgrounds', args.label, args.output_path);
      savedPaths.push(path);
    }

    return {
      content: [{
        type: 'text' as const,
        text: JSON.stringify({ prediction_id: result.id, credits_used: result.creditsUsed, images: savedPaths }, null, 2),
      }],
    };
  },
};
```

**Step 2: Register in index.ts, verify build, commit**

```bash
npx tsc --noEmit
git add src/tools/background-change.ts src/index.ts
git commit -m "feat: add fashn_background_change tool (wraps edit endpoint)"
```

---

### Task 10: Background Remove Tool

**Files:**
- Create: `fashn-mcp/src/tools/background-remove.ts`
- Modify: `fashn-mcp/src/index.ts`

The simplest image tool — just removes background to transparent PNG.

**Step 1: Implement tool**

`fashn-mcp/src/tools/background-remove.ts`:
```typescript
import { z } from 'zod';
import { createFashnClient } from '../lib/fashn-client.js';
import { resolveImageInput, downloadOutput } from '../lib/image-manager.js';

export const backgroundRemoveTool = {
  name: 'fashn_background_remove',
  description: 'Remove the background from an image to create a transparent PNG cutout. Useful for e-commerce product pages. Cost: 1 credit.',
  inputSchema: z.object({
    image: z.string().describe('URL or local file path to the source image'),
    output_path: z.string().optional().describe('Custom output file path'),
    label: z.string().optional().describe('Descriptive label for filename'),
  }),
  async handler(args: any) {
    const client = createFashnClient();

    const inputs: Record<string, any> = {
      image: await resolveImageInput(args.image),
    };

    const result = await client.run('background-remove', inputs);

    const savedPaths: string[] = [];
    for (const url of result.output) {
      const path = await downloadOutput(url, 'cutouts', args.label, args.output_path);
      savedPaths.push(path);
    }

    return {
      content: [{
        type: 'text' as const,
        text: JSON.stringify({ prediction_id: result.id, credits_used: result.creditsUsed, images: savedPaths }, null, 2),
      }],
    };
  },
};
```

**Step 2: Register in index.ts, verify build, commit**

```bash
npx tsc --noEmit
git add src/tools/background-remove.ts src/index.ts
git commit -m "feat: add fashn_background_remove tool"
```

---

### Task 11: Full Build + Wire into POSTED

**Files:**
- Modify: `fashn-mcp/package.json` (verify bin entry)
- Create: `posted-hawaii/.claude/mcp.json` (add fashn server)
- Modify: `fashn-mcp/src/index.ts` (verify all 8 tools registered)

**Step 1: Verify all 8 tools are registered in index.ts**

The final index.ts should import and register all 8 tools:
- `creditsTool` → `fashn_credits`
- `statusTool` → `fashn_status`
- `tryonTool` → `fashn_tryon`
- `productToModelTool` → `fashn_product_to_model`
- `modelCreateTool` → `fashn_model_create`
- `modelSwapTool` → `fashn_model_swap`
- `backgroundChangeTool` → `fashn_background_change`
- `backgroundRemoveTool` → `fashn_background_remove`

**Step 2: Build the project**

```bash
cd /Users/curtisvaughan/claude-code-vault/Projects/POSTED/fashn-mcp
npx tsc
```
Expected: `dist/` directory created with compiled JS files, no errors.

**Step 3: Test the built server starts**

```bash
echo '{"jsonrpc":"2.0","method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"1.0.0"}},"id":1}' | FASHN_API_KEY=test node dist/index.js 2>/dev/null | head -1
```
Expected: JSON-RPC initialize response.

**Step 4: Wire into posted-hawaii**

Update `posted-hawaii/.claude/mcp.json`:
```json
{
  "mcpServers": {
    "fashn": {
      "command": "node",
      "args": ["../fashn-mcp/dist/index.js"],
      "env": {
        "FASHN_API_KEY": "${FASHN_API_KEY}"
      }
    }
  }
}
```

**Step 5: Add FASHN_API_KEY to posted-hawaii .env.local**

The user needs to add their FASHN API key:
```bash
echo "FASHN_API_KEY=your_key_here" >> /Users/curtisvaughan/claude-code-vault/Projects/POSTED/posted-hawaii/.env.local
```

**Step 6: Run all tests**

```bash
cd /Users/curtisvaughan/claude-code-vault/Projects/POSTED/fashn-mcp
npx tsx --test src/**/*.test.ts
```
Expected: All tests pass.

**Step 7: Commit**

```bash
git add -A
git commit -m "feat: complete fashn-mcp with all 8 tools, wire into posted-hawaii"
```

---

## Post-Build: Live Test

Once built and the user has a FASHN API key configured, test the full pipeline in Claude Code:

```
1. Check credits: fashn_credits
2. Create a model: fashn_model_create with prompt "Young local Hawaiian guy, early 20s,
   relaxed confident expression, standing, streetwear lookbook style, 3:4 portrait"
3. Try-on: fashn_tryon with a Printify mockup image + the generated model
4. Background change: fashn_background_change with "Kaka'ako street with colorful murals, golden hour"
```

This exercises 4 tools in sequence and proves the full chain works.
