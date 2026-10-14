import assert from "node:assert/strict";
import { test } from "node:test";
import plugin, { BASE_URL, DEFAULT_MODEL, resolveDynamicModel } from "../dist/index.js";

function registerProvider() {
  const providers = [];
  const api = new Proxy(
    { registerProvider: (provider) => providers.push(provider) },
    { get: (target, key) => target[key] ?? (() => undefined) },
  );
  plugin.register(api);
  assert.equal(providers.length, 1);
  return providers[0];
}

test("registers the standardcompute provider with API-key auth", () => {
  assert.equal(plugin.id, "standardcompute");
  const provider = registerProvider();
  assert.equal(provider.id, "standardcompute");
  assert.equal(provider.label, "Standard Compute");
  assert.deepEqual(provider.envVars, ["STANDARDCOMPUTE_API_KEY"]);
  assert.equal(provider.auth.length, 1);
  assert.equal(provider.auth[0].id, "api-key");
});

test("static catalog uses the public endpoint and the smart-routing default", async () => {
  assert.equal(BASE_URL, "https://api.stdcmpt.com/v1");
  assert.equal(DEFAULT_MODEL, "standardcompute");
  const provider = registerProvider();
  const result = await provider.staticCatalog.run({});
  assert.equal(result.provider.baseUrl, BASE_URL);
  const ids = result.provider.models.map((model) => model.id);
  assert.equal(ids[0], "standardcompute");
  assert.ok(ids.includes("anthropic/claude-sonnet-5.5"));
  assert.ok(!("apiKey" in result.provider));
});

test("resolves uncatalogued model IDs on the configured endpoint", () => {
  assert.equal(resolveDynamicModel({ modelId: "standardcompute" }), undefined);
  assert.equal(resolveDynamicModel({ modelId: "StandardCompute" }), undefined);
  const model = resolveDynamicModel({
    modelId: "anthropic/claude-opus-5.5:eu",
    providerConfig: { baseUrl: "http://127.0.0.1:9/v1" },
  });
  assert.equal(model.id, "anthropic/claude-opus-5.5:eu");
  assert.equal(model.provider, "standardcompute");
  assert.equal(model.baseUrl, "http://127.0.0.1:9/v1");
});
