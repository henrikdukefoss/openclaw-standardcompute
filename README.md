# openclaw-standardcompute

[![Test](https://github.com/henrikdukefoss/openclaw-standardcompute/actions/workflows/test.yml/badge.svg)](https://github.com/henrikdukefoss/openclaw-standardcompute/actions/workflows/test.yml)

[OpenClaw](https://github.com/openclaw/openclaw) provider plugin for [Standard Compute](https://standardcompute.com), an OpenAI-compatible LLM gateway for AI agents.

Standard Compute plans are monthly with a fixed usage budget, starting at $19. Requests draw from that budget instead of being billed per token, and there are no automatic overage charges: when the budget runs out, requests return `402` until it renews or you add budget. That suits always-on OpenClaw agents whose token use is hard to predict. See [pricing](https://standardcompute.com/pricing) and [how budgets work](https://docs.standardcompute.com/budgets-and-limits).

This plugin is published by the Standard Compute team.

## Install

```bash
openclaw plugins install clawhub:@henrikdukefoss/openclaw-standardcompute
```

Requires OpenClaw 2026.10.3 or newer.

## Configure

Create an API key in the [dashboard](https://standardcompute.com/dashboard/api-keys), then either export it:

```bash
export STANDARDCOMPUTE_API_KEY=your-key
```

or save it through onboarding (**Standard Compute API key**):

```bash
openclaw onboard --auth-choice standardcompute-api-key
```

In scripts, pass the key with `--standardcompute-api-key <key>`.

`STANDARD_COMPUTE_API_KEY`, the name used by the `standardcompute` launcher, is also detected.

Make smart routing the default model:

```bash
openclaw models set standardcompute/standardcompute
openclaw config validate
```

- Base URL: `https://api.stdcmpt.com/v1`
- API: OpenAI Responses (`openai-responses`)
- Default model: `standardcompute/standardcompute`

## Models

| Model ref | What it does |
| --- | --- |
| `standardcompute/standardcompute` | Smart routing. The gateway picks a model per request from the models enabled on your [Models page](https://standardcompute.com/dashboard/models). Simple work goes to cheaper models, which stretches the budget. |
| `standardcompute/anthropic/claude-sonnet-5.5` | Pinned to Claude Sonnet 5.5 |
| `standardcompute/openai/gpt-5.6-sol` | Pinned to GPT-5.6 Sol |
| `standardcompute/deepseek/deepseek-v4-pro` | Pinned to DeepSeek V4 Pro |
| `standardcompute/z-ai/glm-5.3` | Pinned to GLM 5.3 |
| `standardcompute/moonshotai/kimi-k3` | Pinned to Kimi K3 |
| `standardcompute/qwen/qwen3.7-plus` | Pinned to Qwen 3.7 Plus |

Any other ID from the public model list also works, for example `standardcompute/anthropic/claude-opus-5.5` or a region-pinned `:eu` / `:us` variant:

```bash
curl -s https://api.stdcmpt.com/v1/models
```

A pinned model is served by that model only; the gateway never switches it for a different one. Pinned premium models use the budget faster than smart routing. Details: [models and routing](https://docs.standardcompute.com/models), [regions and privacy](https://docs.standardcompute.com/regions-and-privacy).

Model limits in the catalog are conservative (8,192 output tokens per request). To change them, add an entry under `models.providers.standardcompute.models` in your OpenClaw config.

## Other ways to connect

- The `standardcompute launch openclaw` launcher starts OpenClaw with a separate Standard Compute profile and leaves your usual setup alone. See the [OpenClaw guide](https://docs.standardcompute.com/agents/openclaw).
- A manual `models.providers` config block is in the same guide.

[![Add to Magpie](https://usemagpie.ai/img/add-to-magpie.svg)](https://usemagpie.ai/import#name=Standard+Compute&id=standardcompute&chat=https%3A%2F%2Fapi.stdcmpt.com%2Fv1&anthropic=https%3A%2F%2Fapi.stdcmpt.com&website=https%3A%2F%2Fstandardcompute.com&keys=https%3A%2F%2Fstandardcompute.com%2Fdashboard%2Fapi-keys&icon=https%3A%2F%2Fstandardcompute.com%2Fapple-icon.png)

Using Magpie? One click adds Standard Compute as a provider (you paste your key in Magpie). Guide: https://standardcompute.com/integrations/magpie

## Related guides

Guides for OpenClaw users on standardcompute.com:

- [OpenClaw setup](https://standardcompute.com/integrations/openclaw): connecting OpenClaw to Standard Compute, step by step.
- [Best budget LLM for OpenClaw](https://standardcompute.com/best-llm-for-openclaw): models compared by cost per task, not per token.
- [Cut OpenClaw's API costs](https://standardcompute.com/cut-ai-agent-api-costs/openclaw): what actually moves the bill, such as heartbeats and long sessions.
- [OpenClaw "API rate limit reached" (429)](https://standardcompute.com/fix/openclaw-rate-limit-reached): causes and fixes.
- [OpenClaw "conflicting plugin install metadata"](https://standardcompute.com/fix/openclaw-plugin-install-sqlite-conflict): fixing a plugin install that fails on shared SQLite state.
- [Run OpenClaw on Hetzner](https://standardcompute.com/guides/run-openclaw-on-hetzner): server sizes, setup and the model bill.

## Development

Requires Node 24.16+ (or 26.1+).

```bash
npm ci --ignore-scripts
npm test          # builds dist/ and runs the tests; no network access
npm pack --dry-run
```

Built against OpenClaw `2026.10.3` (`openclaw.compat` and `openclaw.build` in `package.json`).

## Support

Open an issue in this repository, or see [docs.standardcompute.com](https://docs.standardcompute.com).

## License

MIT
