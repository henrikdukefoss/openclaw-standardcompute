// The published openclaw package does not ship type declarations for this
// plugin-sdk subpath, so declare the part of the entry point this plugin uses.
declare module "openclaw/plugin-sdk/provider-entry" {
  export function defineSingleProviderPluginEntry(options: {
    id: string;
    name: string;
    description: string;
    manifest?: unknown;
    provider: {
      label: string;
      docsPath: string;
      catalog: { allowExplicitBaseUrl?: boolean };
      resolveDynamicModel?: (ctx: never) => unknown;
    };
  }): {
    id: string;
    name: string;
    description: string;
    register(api: unknown): void;
  };
}
