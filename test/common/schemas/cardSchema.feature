Feature: Validação do schema de card

  Scenario: Valida card completo com sucesso
    Given um card com todos os campos válidos preenchidos
    When o cardSchema valida os dados
    Then a validação deve ter sucesso

  Scenario: Rejeita name vazio
    Given um card com name vazio
    When o cardSchema valida os dados
    Then a validação deve falhar com erro no campo "name"

  Scenario: Rejeita sectionId vazio
    Given um card com sectionId vazio
    When o cardSchema valida os dados
    Then a validação deve falhar com erro no campo "sectionId"

  Scenario: Rejeita id menor que 1
    Given um card com id igual a 0
    When o cardSchema valida os dados
    Then a validação deve falhar com erro no campo "id"

  Scenario: Rejeita priority não numérica
    Given um card com priority "alta"
    When o cardSchema valida os dados
    Then a validação deve falhar

  Scenario: Aceita card sem campos opcionais
    Given um card apenas com os campos obrigatórios
    When o cardSchema valida os dados
    Then a validação deve ter sucesso

  Scenario: Valida sub-tarefa dentro de tasks
    Given um card com uma sub-tarefa válida em tasks
    When o cardSchema valida os dados
    Then a validação deve ter sucesso

  Scenario: Valida tag dentro de tags
    Given um card com uma tag com nome "bug"
    When o cardSchema valida os dados
    Then a validação deve ter sucesso

  Scenario: Rejeita tag com nome vazio
    Given um card com uma tag com nome vazio
    When o cardSchema valida os dados
    Then a validação deve falhar

  Scenario: Valida approver com ambiente preenchido
    Given um card com um approver com ambiente "Produção"
    When o cardSchema valida os dados
    Then a validação deve ter sucesso

  Scenario: Rejeita approver com ambiente vazio
    Given um card com um approver com ambiente vazio
    When o cardSchema valida os dados
    Then a validação deve falhar
