/**
 * Call this utility inside test files that need API mocking via MSW.
 *
 * Usage in a test file:
 *   import { setupMswForTest } from '../../mocks/msw/setupMswForTest';
 *   setupMswForTest();
 *
 * This keeps MSW out of the global jest.setup.ts so that pure unit tests
 * (schemas, utils) do not fail due to MSW's ESM dependencies.
 */
import { server } from "./server";

export function setupMswForTest() {
  beforeAll(() => server.listen({ onUnhandledRequest: "warn" }));
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());
}
