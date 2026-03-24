Feature: Componente GenericIcon

  Scenario: Renderiza o nome do ícone como conteúdo
    Given um ícone com nome "home"
    When o componente é renderizado
    Then o texto "home" deve estar no documento

  Scenario: Chama onClick ao ser clicado
    Given um ícone com nome "save" e um handler onClick
    When o ícone é clicado
    Then o handler onClick deve ter sido chamado uma vez

  Scenario: Não chama onClick quando onClick não é passado
    Given um ícone com nome "info" sem onClick
    When o componente é renderizado
    Then o ícone deve estar no documento sem lançar erros

  Scenario: Renderiza com tamanho numérico customizado
    Given um ícone com nome "star" e size 32
    When o componente é renderizado
    Then o texto "star" deve estar no documento
