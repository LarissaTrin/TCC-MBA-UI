Feature: Gerenciamento de cards

  Scenario: Card bloqueado exibe flag blocked
    Given existe um card com blocked igual a true
    When o card é mapeado para Task
    Then a task resultante tem blocked igual a true

  Scenario: Card sem usuário não quebra o mapeamento
    Given existe um card sem usuário atribuído
    When o card é mapeado para Task
    Then a task resultante tem userId undefined
    And a task resultante tem userDisplay undefined

  Scenario: Card com sub-tarefas conta corretamente as completas
    Given existe um card com 3 sub-tarefas sendo 2 completas
    When o card é mapeado para Task
    Then a task tem taskTotal igual a 3
    And a task tem taskCompleted igual a 2

  Scenario: Validação do schema de card com campos obrigatórios ausentes
    Given um objeto de card sem nome
    When o schema de card faz a validação
    Then a validação falha com erro no campo name
