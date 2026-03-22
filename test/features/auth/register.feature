Feature: Registro de novo usuário

  Scenario: Registro com senhas divergentes
    Given o usuário está na página de registro
    When ele preenche os dados de registro com senha "senha123" e confirmação "senhaErrada"
    And clica em registrar
    Then uma mensagem de erro de confirmação de senha é exibida

  Scenario: Registro sem aceitar os termos
    Given o usuário está na página de registro
    When ele preenche os dados de registro válidos mas não aceita os termos
    And clica em registrar
    Then uma mensagem de erro de termos é exibida

  Scenario: Registro com todos os campos válidos
    Given o usuário está na página de registro
    When ele preenche todos os campos corretamente incluindo aceitar os termos
    Then o formulário é considerado válido pelo schema Zod
