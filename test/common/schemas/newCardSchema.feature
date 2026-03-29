Feature: Schema de criação de novo card

  Scenario: Título válido é aceito
    Given um payload com title "My Card"
    When newCardSchema.safeParse é chamado
    Then o resultado deve ser sucesso

  Scenario: Título vazio é rejeitado
    Given um payload com title vazio
    When newCardSchema.safeParse é chamado
    Then o resultado deve ser falha

  Scenario: Título ausente é rejeitado
    Given um payload sem o campo title
    When newCardSchema.safeParse é chamado
    Then o resultado deve ser falha

  Scenario: Título com um único caractere é aceito
    Given um payload com title de um único caractere "A"
    When newCardSchema.safeParse é chamado
    Then o resultado deve ser sucesso
