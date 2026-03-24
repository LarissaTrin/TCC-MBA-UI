Feature: Componente GenericModal

  Scenario: Exibe o conteúdo quando open é true
    Given um modal aberto com conteúdo "Conteúdo do modal"
    When o componente é renderizado
    Then o texto "Conteúdo do modal" deve estar no documento

  Scenario: Renderiza o título quando fornecido
    Given um modal aberto com título "Meu Título"
    When o componente é renderizado
    Then o texto "Meu Título" deve estar no documento

  Scenario: Não renderiza o conteúdo quando open é false
    Given um modal fechado com conteúdo "Conteúdo oculto"
    When o componente é renderizado
    Then o texto "Conteúdo oculto" não deve estar no documento

  Scenario: Renderiza sem título quando title não é fornecido
    Given um modal aberto sem título
    When o componente é renderizado
    Then nenhum heading deve estar no documento
