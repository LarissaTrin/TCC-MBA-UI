Feature: Componente GenericTabs

  Scenario: Renderiza todos os tabs passados
    Given uma lista de tabs com labels "Início" e "Projetos"
    When o componente é renderizado
    Then os textos "Início" e "Projetos" devem estar no documento

  Scenario: Chama handleChange ao clicar em um tab
    Given tabs com labels "A" e "B" e um handler handleChange
    When o tab "B" é clicado
    Then o handler handleChange deve ter sido chamado

  Scenario: Renderiza com orientação vertical
    Given uma lista de tabs com orientação vertical
    When o componente é renderizado
    Then o componente de tabs deve estar no documento

  Scenario: Renderiza o tab selecionado corretamente
    Given tabs com selectedTab 1 e labels "X" e "Y"
    When o componente é renderizado
    Then o tab "Y" deve ter atributo aria-selected true
