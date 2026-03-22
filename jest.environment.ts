/**
 * Custom Jest environment that extends jsdom to include Node 18+ fetch globals.
 * Required by MSW v2 (@mswjs/interceptors) which references Response/Request/fetch
 * at module import time. jest-environment-jsdom does not expose these from Node.
 */
import { TestEnvironment } from "jest-environment-jsdom";
import { TextDecoder, TextEncoder } from "util";

export default class FixedJSDomEnvironment extends TestEnvironment {
  async setup() {
    await super.setup();

    // jest-environment-jsdom with customExportConditions: ['node'] resolves the
    // Node.js MSW interceptors, which require TextEncoder, TextDecoder, and the
    // Fetch API globals (Response, Request, Headers, fetch).
    // jsdom does not include all of these — patch them here.

    // TextEncoder / TextDecoder (needed by @mswjs/interceptors bufferUtils)
    this.global.TextEncoder = TextEncoder;
    this.global.TextDecoder = TextDecoder as unknown as typeof this.global.TextDecoder;

    // Fetch API (needed by @mswjs/interceptors fetchUtils)
    const nodeGlobal = global as Record<string, unknown>;

    const fetchGlobals: Array<keyof typeof this.global> = [
      "fetch",
      "Request",
      "Response",
      "Headers",
      "ReadableStream",
      "WritableStream",
      "TransformStream",
      "FormData",
      "Blob",
      "File",
    ];

    for (const key of fetchGlobals) {
      if (
        typeof this.global[key] === "undefined" &&
        typeof nodeGlobal[key] !== "undefined"
      ) {
        // @ts-ignore – dynamic assignment to jsdom global
        this.global[key] = nodeGlobal[key];
      }
    }
  }
}
