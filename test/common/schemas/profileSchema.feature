Feature: Schema de senha do perfil

  Scenario: Senhas iguais são aceitas
    Given um payload com password "abc123" e confirmPassword "abc123"
    When passwordSchema.safeParse é chamado
    Then o resultado deve ser sucesso

  Scenario: Senhas diferentes falham em confirmPassword
    Given um payload com password "abc123" e confirmPassword "different"
    When passwordSchema.safeParse é chamado
    Then o resultado deve ser falha com erro no campo confirmPassword

  Scenario: Strings vazias passam como campos opcionais
    Given um payload com password vazio e confirmPassword vazio
    When passwordSchema.safeParse é chamado
    Then o resultado deve ser sucesso

  Scenario: Senha com menos de 6 caracteres é rejeitada
    Given um payload com password "abc" e confirmPassword "abc"
    When passwordSchema.safeParse é chamado
    Then o resultado deve ser falha

  Scenario: Payload vazio é aceito como campos opcionais
    Given um payload vazio
    When passwordSchema.safeParse é chamado
    Then o resultado deve ser sucesso
