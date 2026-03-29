/**
 * Tests for common/services/tagService.ts
 */
import { http, HttpResponse } from "msw";
import { setupMswForTest } from "../../mocks/msw/setupMswForTest";
import { server } from "../../mocks/msw/server";
import { tagService } from "@/common/services/tagService";
import { setAuthToken } from "@/common/utils/tokenStore";

setupMswForTest();

const BASE = "http://localhost:8000/api";

beforeEach(() => setAuthToken("token"));
afterEach(() => setAuthToken(null));

test("getProjectTags returns all tags without query", async () => {
  server.use(
    http.get(`${BASE}/projects/1/tags`, ({ request }) => {
      const url = new URL(request.url);
      const q = url.searchParams.get("q");
      return HttpResponse.json(
        q
          ? []
          : [
              { id: 1, name: "backend" },
              { id: 2, name: "frontend" },
            ]
      );
    })
  );
  const tags = await tagService.getProjectTags(1);
  expect(tags).toHaveLength(2);
  expect(tags[0].name).toBe("backend");
});

test("getProjectTags appends q param when provided", async () => {
  server.use(
    http.get(`${BASE}/projects/1/tags`, ({ request }) => {
      const url = new URL(request.url);
      const q = url.searchParams.get("q");
      return HttpResponse.json(
        q === "back" ? [{ id: 1, name: "backend" }] : []
      );
    })
  );
  const tags = await tagService.getProjectTags(1, "back");
  expect(tags).toHaveLength(1);
  expect(tags[0].name).toBe("backend");
});

test("getProjectTags encodes special characters in query", async () => {
  server.use(
    http.get(`${BASE}/projects/2/tags`, ({ request }) => {
      const url = new URL(request.url);
      const q = url.searchParams.get("q");
      return HttpResponse.json(q ? [{ id: 5, name: q }] : []);
    })
  );
  const tags = await tagService.getProjectTags(2, "my tag");
  expect(tags[0].name).toBe("my tag");
});
