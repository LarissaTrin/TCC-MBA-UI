Feature: Componente GenericButton

  Scenario: Renderiza o label fornecido
    Given um botão com label "Salvar"
    When o componente é renderizado
    Then deve existir um botão com o texto "Salvar"

  Scenario: Chama onClick ao ser clicado
    Given um botão com label "Clique" e um handler onClick
    When o botão é clicado
    Then o handler onClick deve ter sido chamado uma vez

  Scenario: Fica desabilitado quando disabled é true
    Given um botão com label "Desabilitado" e disabled igual a true
    When o componente é renderizado
    Then o botão deve estar desabilitado

  Scenario: Não chama onClick quando está desabilitado
    Given um botão com label "Não clique" disabled e um handler onClick
    When o botão é clicado
    Then o handler onClick não deve ter sido chamado

  Scenario: Aplica variant text corretamente
    Given um botão com label "Text" e variant text
    When o componente é renderizado
    Then o botão deve estar presente no documento

  Scenario: Renderiza sem label no modo ícone
    Given um botão sem label e com ícone "save"
    When o componente é renderizado
    Then deve existir um botão no documento
