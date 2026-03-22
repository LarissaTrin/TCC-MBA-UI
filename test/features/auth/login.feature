Feature: Login de usuário

  Scenario: Login com credenciais válidas
    Given o usuário está na página de login
    When ele preenche o email "user@test.com" e a senha "123456"
    And clica no botão de entrar
    Then a função de autenticação é chamada com as credenciais corretas

  Scenario: Login com email inválido
    Given o usuário está na página de login
    When ele preenche o email "email-invalido" e a senha "123456"
    And clica no botão de entrar
    Then uma mensagem de erro de email é exibida

  Scenario: Login com senha muito curta
    Given o usuário está na página de login
    When ele preenche o email "user@test.com" e a senha "123"
    And clica no botão de entrar
    Then uma mensagem de erro de senha é exibida
