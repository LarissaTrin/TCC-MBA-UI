import { http, HttpResponse } from "msw";
import {
  buildUser,
  buildCard,
  buildSection,
  buildProject,
} from "../factories";

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const authHandlers = [
  http.post("*/auth/login", () =>
    HttpResponse.json({
      access_token: "fake-jwt-token",
      user: buildUser(),
    })
  ),
  http.post("*/auth/register", () =>
    HttpResponse.json({ message: "Registered successfully" }, { status: 201 })
  ),
  http.post("*/auth/forgot-password", () =>
    HttpResponse.json({ message: "Email sent" })
  ),
  http.post("*/auth/change-password/*", () =>
    HttpResponse.json({ message: "Password changed" })
  ),
];

// ─── Projects ─────────────────────────────────────────────────────────────────

export const projectHandlers = [
  http.get("*/projects/", () =>
    HttpResponse.json([buildProject({ id: 1 }), buildProject({ id: 2 })])
  ),
  http.post("*/projects/", () =>
    HttpResponse.json(buildProject({ id: 3 }), { status: 201 })
  ),
  http.put("*/projects/:id/", ({ params }) =>
    HttpResponse.json(buildProject({ id: Number(params.id) }))
  ),
  http.delete("*/projects/:id/", () => new HttpResponse(null, { status: 204 })),
];

// ─── Lists / Sections ─────────────────────────────────────────────────────────

export const listHandlers = [
  http.get("*/projects/:projectId/lists/", ({ params }) => {
    const projectId = Number(params.projectId);
    return HttpResponse.json([
      buildSection({ id: "1", name: "To Do", order: 0 }),
      buildSection({ id: "2", name: "In Progress", order: 1 }),
      buildSection({ id: "3", name: "Done", order: 2, isFinal: true }),
    ]);
  }),
  http.get("*/projects/:projectId/lists/:listId/cards", ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page") ?? 1);
    const limit = Number(url.searchParams.get("limit") ?? 20);
    const cards = Array.from({ length: Math.min(limit, 5) }, (_, i) =>
      buildCard({ id: i + 1 + (page - 1) * limit })
    );
    return HttpResponse.json({
      cards,
      total: 25,
      page,
      has_more: page === 1,
    });
  }),
];

// ─── Cards ────────────────────────────────────────────────────────────────────

export const cardHandlers = [
  http.get("*/projects/:projectId/cards/:cardId/", ({ params }) =>
    HttpResponse.json(buildCard({ id: Number(params.cardId) }))
  ),
  http.post("*/projects/:projectId/cards/", () =>
    HttpResponse.json(buildCard({ id: 99 }), { status: 201 })
  ),
  http.put("*/projects/:projectId/cards/:cardId/", ({ params }) =>
    HttpResponse.json(buildCard({ id: Number(params.cardId) }))
  ),
  http.delete("*/projects/:projectId/cards/:cardId/", () =>
    new HttpResponse(null, { status: 204 })
  ),
];

// ─── All handlers ─────────────────────────────────────────────────────────────

export const handlers = [
  ...authHandlers,
  ...projectHandlers,
  ...listHandlers,
  ...cardHandlers,
];
