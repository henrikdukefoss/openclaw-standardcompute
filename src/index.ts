/**
 * Standard Compute provider plugin for OpenClaw.
 *
 * Standard Compute is an OpenAI-compatible LLM gateway. The provider, its
 * API-key auth and its model catalog are declared in openclaw.plugin.json;
 * this entry registers them and lets any other model ID from
 * https://api.stdcmpt.com/v1/models be used without a plugin release.
 */
import { createRequire } from "node:module";
import { defineSingleProviderPluginEntry } from "openclaw/plugin-sdk/provider-entry";

const requireJson = createRequire(import.meta.url);
// Resolved relative to both src/ and dist/.
export const manifest = requireJson("../openclaw.plugin.json") as {
  modelCatalog: {
    providers: {
      standardcompute: {
        baseUrl: string;
        api: string;
        defaultModel: string;
        models: Array<{ id: string }>;
      };
    };
  };
};

export const PROVIDER_ID = "standardcompute";
const CATALOG = manifest.modelCatalog.providers.standardcompute;
export const BASE_URL = CATALOG.baseUrl;
export const API = CATALOG.api;
export const DEFAULT_MODEL = CATALOG.defaultModel;

const CATALOG_IDS = new Set(CATALOG.models.map((model) => model.id.toLowerCase()));

type DynamicModelContext = {
  modelId: string;
  providerConfig?: { baseUrl?: string };
};

/**
 * Resolves model IDs that are not in the static catalog, such as
 * `anthropic/claude-opus-5.5` or a regional `:eu` / `:us` variant, into a
 * conservative text model on the same endpoint. The gateway rejects IDs it
 * does not serve with `400 model_not_found`.
 */
export function resolveDynamicModel(ctx: DynamicModelContext) {
  const modelId = ctx.modelId.trim();
  if (!modelId || CATALOG_IDS.has(modelId.toLowerCase())) {
    return undefined;
  }
  return {
    id: modelId,
    name: modelId,
    provider: PROVIDER_ID,
    api: API,
    baseUrl: ctx.providerConfig?.baseUrl ?? BASE_URL,
    reasoning: false,
    input: ["text"] as Array<"text" | "image">,
    // Usage is drawn from the plan's monthly budget, not billed per token here.
    cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
    contextWindow: 128000,
    maxTokens: 8192,
  };
}

export default defineSingleProviderPluginEntry({
  id: PROVIDER_ID,
  name: "Standard Compute",
  description: "Standard Compute model provider (OpenAI-compatible gateway)",
  manifest,
  provider: {
    label: "Standard Compute",
    docsPath: "/providers/models",
    catalog: {
      allowExplicitBaseUrl: true,
    },
    resolveDynamicModel,
  },
});
