let _idCounter = 1;

interface Project {
  id: number;
  title: string;
  description?: string;
}

export function buildProject(overrides: Partial<Project> = {}): Project {
  const id = overrides.id ?? _idCounter++;
  return {
    id,
    title: `Project ${id}`,
    description: `Description for project ${id}`,
    ...overrides,
  };
}
