Feature: Seção de sub-tarefas do card

  Scenario: Exibe mensagem quando não há sub-tarefas
    Given um formulário de card sem sub-tarefas
    When CardTasksSection é renderizado
    Then deve exibir a mensagem de lista vazia

  Scenario: Adiciona nova sub-tarefa ao clicar no botão adicionar
    Given um formulário de card sem sub-tarefas
    When o botão de adicionar sub-tarefa é clicado
    Then deve aparecer um campo para o título da sub-tarefa
    And a mensagem de lista vazia não deve ser exibida

  Scenario: Remove sub-tarefa ao clicar no botão deletar
    Given um formulário de card com uma sub-tarefa adicionada
    When o botão de deletar a sub-tarefa é clicado
    Then a lista de sub-tarefas deve ficar vazia novamente

  Scenario: Permite adicionar múltiplas sub-tarefas
    Given um formulário de card sem sub-tarefas
    When o botão de adicionar sub-tarefa é clicado 3 vezes
    Then devem aparecer 3 campos de título de sub-tarefa
