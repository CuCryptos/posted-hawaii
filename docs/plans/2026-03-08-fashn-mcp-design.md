# fashn-mcp Design

## Goal

Build an MCP server wrapping the FASHN AI API so Claude Code can do virtual try-on, model creation, model swapping, background changes, and product photography through tool calls. The MCP handles API communication, async polling, image download, and local file management.

## Location

`/Users/curtisvaughan/claude-code-vault/Projects/POSTED/fashn-mcp/` — sibling to posted-hawaii and posted-brain. Referenced from posted-hawaii via relative path `../fashn-mcp/dist/index.js`.

```
/Users/curtisvaughan/claude-code-vault/Projects/POSTED/
├── posted-hawaii/          # The website (Next.js)
├── posted-brain/           # Competitive intelligence CLI
├── fashn-mcp/              # FASHN AI MCP server  <-- NEW
└── CLAUDE.md
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js 20+ |
| Language | TypeScript |
| MCP SDK | `@modelcontextprotocol/sdk` |
| FASHN SDK | `fashn` (official TypeScript SDK) |
| Transport | stdio |

## Project Structure

```
fashn-mcp/
├── src/
│   ├── index.ts              # MCP server entry point, tool registration
│   ├── tools/
│   │   ├── tryon.ts          # fashn_tryon
│   │   ├── product-to-model.ts
│   │   ├── model-create.ts
│   │   ├── model-swap.ts
│   │   ├── background-change.ts
│   │   ├── background-remove.ts
│   │   ├── credits.ts
│   │   └── status.ts         # fashn_status (prediction debugging)
│   └── lib/
│       ├── fashn-client.ts   # SDK wrapper with raw REST fallback
│       └── image-manager.ts  # Download, save, organize, resize
├── package.json
├── tsconfig.json
└── CLAUDE.md
```

## Tools (8 total)

| Tool | FASHN Model | Purpose |
|------|------------|---------|
| `fashn_tryon` | tryon-v1.6 | Put a garment onto a model photo |
| `fashn_product_to_model` | product-to-model | Flat lay to on-model shot |
| `fashn_model_create` | model-create | Generate AI model from text prompt |
| `fashn_model_swap` | model-swap | Replace model, keep garment + background |
| `fashn_background_change` | background-change | Swap background via text prompt |
| `fashn_background_remove` | background-remove | Transparent PNG cutout |
| `fashn_credits` | credits endpoint | Check credit balance |
| `fashn_status` | status endpoint | Check prediction status by ID |

## Data Flow

1. Claude Code calls a tool with local file paths or URLs
2. Image manager resolves local paths:
   - If file > 5MB, resize down before conversion (FASHN output is 576x864 — large inputs waste bandwidth)
   - Convert to base64 data URI for the FASHN API
3. FASHN client tries SDK `subscribe()` first (handles submit + poll)
4. If SDK doesn't support that model_name, falls back to raw REST (POST /v1/run + poll /v1/status)
5. Output URLs downloaded immediately (FASHN CDN expires in 72h)
6. Saved to `~/Documents/fashn-images/` with descriptive filenames
7. Local file path returned to Claude Code

## FASHN Client Strategy

The `fashn` npm SDK is relatively new. Some newer endpoints (model-create, model-swap, model-variation) may not be supported by `subscribe()` yet. The client wrapper handles this:

```
trySDK(modelName, inputs)
  → if SDK supports it: use subscribe() (cleaner, handles polling)
  → if SDK throws "unsupported model": fall back to raw REST
      POST /v1/run → poll /v1/status/{id} → return output
```

Both paths produce the same output shape. Tools don't care which path ran.

## Image Manager

### Input Resolution
- Local file path → check size → resize if >5MB → base64 data URI
- URL → pass through directly to FASHN API

### Output Management
- Download from FASHN CDN immediately on completion
- Save to organized folder structure:

```
~/Documents/fashn-images/
├── tryon/              # Virtual try-on results
├── product-to-model/   # Flat lay to on-model
├── models/             # Generated AI models
├── swaps/              # Model swap results
├── backgrounds/        # Background change results
├── cutouts/            # Background-removed PNGs
└── temp/               # Intermediate files
```

### File Naming
Descriptive auto-names: `tryon-sandys-tee-model01-20260308-a1b2c3.png`

The tool caller can also pass `output_path` to override the default location.

## MCP Configuration

In `posted-hawaii/.claude/mcp.json`:
```json
{
  "mcpServers": {
    "fashn": {
      "command": "node",
      "args": ["../fashn-mcp/dist/index.js"],
      "env": {
        "FASHN_API_KEY": "YOUR_KEY"
      }
    }
  }
}
```

## Cost

~$0.075 per operation. Full POSTED website launch (8 products, 3 model variations each, background swaps, cutouts): ~84 credits, ~$6.30.

## Build Order

1. **Phase 1:** MCP skeleton + fashn_credits + fashn_status + fashn_tryon (prove the pipeline)
2. **Phase 2:** fashn_product_to_model, fashn_model_create, fashn_model_swap
3. **Phase 3:** fashn_background_change, fashn_background_remove
4. **Phase 4:** Wire into posted-hawaii mcp.json, test with real product images

## What's NOT in v1

Extended tools (face-to-model, model-variation, edit, reframe, image-to-video) ship later. npm publish happens after the core 8 tools are tested and working.
