Feature: Mapeamento de Cards para Tasks

  Scenario: Converte campos básicos id, title e subtitle
    Given um card com id 42, name "Meu Card" e status InProgress
    When mapCardsToTasks é chamado
    Then a task deve ter id 42, title "Meu Card" e subtitle InProgress

  Scenario: Usa data de hoje como startDate quando não informada
    Given um card sem startDate
    When mapCardsToTasks é chamado
    Then a task deve ter startDate igual à data de hoje

  Scenario: Usa data de hoje como endDate quando não informada
    Given um card sem endDate
    When mapCardsToTasks é chamado
    Then a task deve ter endDate igual à data de hoje

  Scenario: Preserva startDate e endDate quando fornecidos
    Given um card com startDate "2026-01-01" e endDate "2026-01-31"
    When mapCardsToTasks é chamado
    Then a task deve ter startDate "2026-01-01" e endDate "2026-01-31"

  Scenario: Card bloqueado gera task com blocked true
    Given um card com blocked igual a true
    When mapCardsToTasks é chamado
    Then a task deve ter blocked igual a true

  Scenario: Card não bloqueado gera task com blocked false
    Given um card com blocked igual a false
    When mapCardsToTasks é chamado
    Then a task deve ter blocked igual a false

  Scenario: Card sem usuário gera userId e userDisplay undefined
    Given um card sem usuário atribuído
    When mapCardsToTasks é chamado
    Then a task deve ter userId e userDisplay indefinidos

  Scenario: Card com usuário gera userDisplay com nome completo
    Given um card com usuário de firstName "João" e lastName "Silva"
    When mapCardsToTasks é chamado
    Then a task deve ter userDisplay "João Silva" e userId correto

  Scenario: Conta sub-tarefas totais e completadas corretamente
    Given um card com 3 sub-tarefas sendo 2 completadas
    When mapCardsToTasks é chamado
    Then a task deve ter taskTotal 3 e taskCompleted 2

  Scenario: Card sem tasks tem contadores zerados
    Given um card sem sub-tarefas
    When mapCardsToTasks é chamado
    Then a task deve ter taskTotal 0 e taskCompleted 0

  Scenario: Card com tags preserva o array de tags
    Given um card com 2 tags "bug" e "feature"
    When mapCardsToTasks é chamado
    Then a task deve ter 2 tags sendo a primeira "bug"

  Scenario: Converte lista vazia sem erros
    Given uma lista vazia de cards
    When mapCardsToTasks é chamado
    Then o resultado deve ser um array vazio

  Scenario: Converte múltiplos cards mantendo a ordem
    Given uma lista de 5 cards
    When mapCardsToTasks é chamado
    Then o resultado deve ter 5 tasks na mesma ordem
