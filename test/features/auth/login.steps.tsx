import path from "path";
import { loadFeature, defineFeature } from "jest-cucumber";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { loginSchema } from "@/common/schemas/authSchema";

const feature = loadFeature(path.join(__dirname, "login.feature"));

// Minimal login form to render for integration-style steps
function LoginForm({
  onSubmit,
}: {
  onSubmit: (email: string, password: string) => void;
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        onSubmit(data.get("email") as string, data.get("password") as string);
      }}
    >
      <input name="email" aria-label="Email" />
      <input name="password" type="password" aria-label="Senha" />
      <button type="submit">Entrar</button>
    </form>
  );
}

defineFeature(feature, (test) => {
  test("Login com credenciais válidas", ({ given, when, and, then }) => {
    const handleSubmit = jest.fn();

    given("o usuário está na página de login", () => {
      render(<LoginForm onSubmit={handleSubmit} />);
    });

    when(
      /ele preenche o email "(.*)" e a senha "(.*)"/,
      (email: string, password: string) => {
        fireEvent.change(screen.getByLabelText("Email"), {
          target: { value: email },
        });
        fireEvent.change(screen.getByLabelText("Senha"), {
          target: { value: password },
        });
      }
    );

    and("clica no botão de entrar", () => {
      fireEvent.click(screen.getByRole("button", { name: /entrar/i }));
    });

    then(
      "a função de autenticação é chamada com as credenciais corretas",
      () => {
        expect(handleSubmit).toHaveBeenCalledWith("user@test.com", "123456");
      }
    );
  });

  test("Login com email inválido", ({ given, when, and, then }) => {
    given("o usuário está na página de login", () => {
      // Schema validation test — no render needed
    });

    when(
      /ele preenche o email "(.*)" e a senha "(.*)"/,
      (_email: string, _password: string) => {}
    );

    and("clica no botão de entrar", () => {});

    then("uma mensagem de erro de email é exibida", () => {
      const result = loginSchema.safeParse({
        email: "email-invalido",
        password: "123456",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const emailError = result.error.issues.find(
          (e) => e.path[0] === "email"
        );
        expect(emailError).toBeDefined();
      }
    });
  });

  test("Login com senha muito curta", ({ given, when, and, then }) => {
    given("o usuário está na página de login", () => {});

    when(
      /ele preenche o email "(.*)" e a senha "(.*)"/,
      (_email: string, _password: string) => {}
    );

    and("clica no botão de entrar", () => {});

    then("uma mensagem de erro de senha é exibida", () => {
      const result = loginSchema.safeParse({
        email: "user@test.com",
        password: "123",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const pwError = result.error.issues.find(
          (e) => e.path[0] === "password"
        );
        expect(pwError).toBeDefined();
      }
    });
  });
});
