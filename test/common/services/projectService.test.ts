/**
 * Tests for common/services/projectService.ts
 */
import { http, HttpResponse } from "msw";
import { setupMswForTest } from "../../mocks/msw/setupMswForTest";
import { server } from "../../mocks/msw/server";
import { projectService } from "@/common/services/projectService";
import { setAuthToken } from "@/common/utils/tokenStore";

setupMswForTest();

const BASE = "http://localhost:8000/api";

beforeEach(() => setAuthToken("token"));
afterEach(() => setAuthToken(null));

const projectApiResponse = (id = 1) => ({
  id,
  title: `Project ${id}`,
  description: `Desc ${id}`,
  projectUsers: [],
});

// ── getAll ────────────────────────────────────────────────────────────────────

test("getAll returns mapped projects", async () => {
  server.use(
    http.get(`${BASE}/projects/`, () =>
      HttpResponse.json([projectApiResponse(1), projectApiResponse(2)])
    )
  );
  const projects = await projectService.getAll();
  expect(projects).toHaveLength(2);
  expect(projects[0].id).toBe(1);
  expect(projects[0].projectName).toBe("Project 1");
});

// ── getById ───────────────────────────────────────────────────────────────────

test("getById returns mapped project", async () => {
  server.use(
    http.get(`${BASE}/projects/5`, () => HttpResponse.json(projectApiResponse(5)))
  );
  const project = await projectService.getById(5);
  expect(project).toBeDefined();
  expect(project!.id).toBe(5);
  expect(project!.projectName).toBe("Project 5");
});

test("getById returns undefined on error", async () => {
  server.use(
    http.get(`${BASE}/projects/99`, () =>
      HttpResponse.json({ detail: "Not found" }, { status: 404 })
    )
  );
  const project = await projectService.getById(99);
  expect(project).toBeUndefined();
});

// ── getDetailById ─────────────────────────────────────────────────────────────

test("getDetailById returns project with members", async () => {
  server.use(
    http.get(`${BASE}/projects/3`, () =>
      HttpResponse.json({
        ...projectApiResponse(3),
        projectUsers: [
          {
            id: 10,
            userId: 2,
            roleId: 1,
            user: { id: 2, firstName: "Ana", lastName: "Silva", email: "ana@test.com" },
            role: { id: 1, name: "Admin" },
          },
        ],
      })
    )
  );
  const detail = await projectService.getDetailById(3);
  expect(detail).toBeDefined();
  expect(detail!.projectUsers).toHaveLength(1);
  expect(detail!.projectUsers[0].userId).toBe(2);
});

test("getDetailById returns undefined on error", async () => {
  server.use(
    http.get(`${BASE}/projects/0`, () =>
      HttpResponse.json({ detail: "Not found" }, { status: 404 })
    )
  );
  const detail = await projectService.getDetailById(0);
  expect(detail).toBeUndefined();
});

// ── create ────────────────────────────────────────────────────────────────────

test("create sends title and returns mapped project", async () => {
  server.use(
    http.post(`${BASE}/projects/`, async ({ request }) => {
      const body = (await request.json()) as { title: string };
      return HttpResponse.json(
        { id: 42, title: body.title, description: "" },
        { status: 201 }
      );
    })
  );
  const project = await projectService.create({ projectName: "New Project" });
  expect(project.id).toBe(42);
  expect(project.projectName).toBe("New Project");
});

// ── update ────────────────────────────────────────────────────────────────────

test("update sends PUT and resolves", async () => {
  server.use(
    http.put(`${BASE}/projects/1`, () =>
      HttpResponse.json(projectApiResponse(1))
    )
  );
  await expect(
    projectService.update(1, { projectName: "Updated", description: "Desc" })
  ).resolves.toBeUndefined();
});

// ── delete ────────────────────────────────────────────────────────────────────

test("delete sends DELETE and resolves", async () => {
  server.use(
    http.delete(`${BASE}/projects/1`, () => new HttpResponse(null, { status: 204 }))
  );
  await expect(projectService.delete(1)).resolves.toBeUndefined();
});

// ── inviteUsers ───────────────────────────────────────────────────────────────

test("inviteUsers sends invite and returns response", async () => {
  server.use(
    http.post(`${BASE}/projects/1/members/invite`, () =>
      HttpResponse.json({ invited: ["a@b.com"], failed: [] })
    )
  );
  const result = await projectService.inviteUsers(1, [
    { email: "a@b.com", role: "User" },
  ]);
  expect(result).toEqual({ invited: ["a@b.com"], failed: [] });
});

// ── removeMember ──────────────────────────────────────────────────────────────

test("removeMember sends DELETE and resolves", async () => {
  server.use(
    http.delete(`${BASE}/projects/1/members/2`, () =>
      new HttpResponse(null, { status: 204 })
    )
  );
  await expect(projectService.removeMember(1, 2)).resolves.toBeUndefined();
});

// ── updateMemberRole ──────────────────────────────────────────────────────────

test("updateMemberRole sends PUT and resolves", async () => {
  server.use(
    http.put(`${BASE}/projects/1/members/2`, () => HttpResponse.json({}))
  );
  await expect(
    projectService.updateMemberRole(1, 2, "Leader")
  ).resolves.toBeUndefined();
});

// ── searchMembers ─────────────────────────────────────────────────────────────

test("searchMembers returns autocomplete options", async () => {
  server.use(
    http.get(`${BASE}/projects/1/members/search`, () =>
      HttpResponse.json([
        { id: 3, firstName: "Carlos", lastName: "Souza", email: "c@t.com" },
      ])
    )
  );
  const options = await projectService.searchMembers(1, "carlos");
  expect(options).toHaveLength(1);
  expect(options[0].value).toBe("3");
  expect(options[0].label).toBe("Carlos Souza");
});
