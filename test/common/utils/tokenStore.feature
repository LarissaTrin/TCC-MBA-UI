Feature: Armazenamento de token de autenticação

  Scenario: getAuthToken retorna null inicialmente
    Given o token é definido como null
    When getAuthToken é chamado
    Then o resultado deve ser null

  Scenario: setAuthToken armazena e getAuthToken recupera o token
    Given setAuthToken é chamado com "my-jwt-token"
    When getAuthToken é chamado
    Then o resultado deve ser "my-jwt-token"

  Scenario: setAuthToken com undefined armazena null
    Given um token "some-token" foi armazenado
    When setAuthToken é chamado com undefined
    Then getAuthToken deve retornar null

  Scenario: setAuthToken com null limpa o token
    Given um token "some-token" foi armazenado
    When setAuthToken é chamado com null
    Then getAuthToken deve retornar null

  Scenario: setAuthToken substitui o token anterior
    Given o token "first-token" foi armazenado
    When setAuthToken é chamado com "second-token"
    Then getAuthToken deve retornar "second-token"
