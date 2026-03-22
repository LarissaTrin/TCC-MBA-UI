import "@testing-library/jest-dom";

// Mock next/navigation globally — components that use useSearchParams / useRouter
// will get these defaults unless overridden inside individual tests.
jest.mock("next/navigation", () => ({
  useSearchParams: jest.fn(() => new URLSearchParams()),
  useRouter: jest.fn(() => ({ replace: jest.fn(), push: jest.fn() })),
  usePathname: jest.fn(() => "/"),
  useParams: jest.fn(() => ({})),
}));

// Mock next-auth/react globally
jest.mock("next-auth/react", () => ({
  useSession: jest.fn(() => ({
    data: {
      user: { id: "1", firstName: "Test", lastName: "User", email: "test@example.com" },
      accessToken: "fake-token",
    },
    status: "authenticated",
  })),
  signIn: jest.fn(),
  signOut: jest.fn(),
}));

// MUI requires window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock ResizeObserver (used by some MUI components)
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));
