import type { Section } from "@/common/model/section";

export function buildSection(overrides: Partial<Section> = {}): Section {
  return {
    id: "1",
    name: "To Do",
    order: 0,
    isFinal: false,
    ...overrides,
  };
}

export function buildSectionList(): Section[] {
  return [
    buildSection({ id: "1", name: "To Do", order: 0 }),
    buildSection({ id: "2", name: "In Progress", order: 1 }),
    buildSection({ id: "3", name: "Done", order: 2, isFinal: true }),
  ];
}
