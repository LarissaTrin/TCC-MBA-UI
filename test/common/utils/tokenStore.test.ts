import path from "path";
import { loadFeature, defineFeature } from "jest-cucumber";
import { getAuthToken, setAuthToken } from "@/common/utils/tokenStore";

const feature = loadFeature(path.join(__dirname, "tokenStore.feature"));

afterEach(() => setAuthToken(null));

defineFeature(feature, (test) => {
  test("getAuthToken retorna null inicialmente", ({ given, when, then }) => {
    let result: string | null;

    given("o token é definido como null", () => {
      setAuthToken(null);
    });

    when("getAuthToken é chamado", () => {
      result = getAuthToken();
    });

    then("o resultado deve ser null", () => {
      expect(result).toBeNull();
    });
  });

  test("setAuthToken armazena e getAuthToken recupera o token", ({ given, when, then }) => {
    let result: string | null;

    given("setAuthToken é chamado com \"my-jwt-token\"", () => {
      setAuthToken("my-jwt-token");
    });

    when("getAuthToken é chamado", () => {
      result = getAuthToken();
    });

    then("o resultado deve ser \"my-jwt-token\"", () => {
      expect(result).toBe("my-jwt-token");
    });
  });

  test("setAuthToken com undefined armazena null", ({ given, when, then }) => {
    let result: string | null;

    given("um token \"some-token\" foi armazenado", () => {
      setAuthToken("some-token");
    });

    when("setAuthToken é chamado com undefined", () => {
      setAuthToken(undefined);
    });

    then("getAuthToken deve retornar null", () => {
      result = getAuthToken();
      expect(result).toBeNull();
    });
  });

  test("setAuthToken com null limpa o token", ({ given, when, then }) => {
    let result: string | null;

    given("um token \"some-token\" foi armazenado", () => {
      setAuthToken("some-token");
    });

    when("setAuthToken é chamado com null", () => {
      setAuthToken(null);
    });

    then("getAuthToken deve retornar null", () => {
      result = getAuthToken();
      expect(result).toBeNull();
    });
  });

  test("setAuthToken substitui o token anterior", ({ given, when, then }) => {
    let result: string | null;

    given("o token \"first-token\" foi armazenado", () => {
      setAuthToken("first-token");
    });

    when("setAuthToken é chamado com \"second-token\"", () => {
      setAuthToken("second-token");
    });

    then("getAuthToken deve retornar \"second-token\"", () => {
      result = getAuthToken();
      expect(result).toBe("second-token");
    });
  });
});
