Feature: Componente GenericAlert

  Scenario: Exibe o conteúdo quando open é true
    Given um alert com conteúdo "Salvo com sucesso" e open true
    When o componente é renderizado
    Then o texto "Salvo com sucesso" deve estar no documento

  Scenario: Renderiza o alert com severidade success por padrão
    Given um alert aberto sem severidade definida
    When o componente é renderizado
    Then deve existir um elemento com role alert no documento

  Scenario: Renderiza o alert com severidade error
    Given um alert aberto com severidade error e conteúdo "Erro ao salvar"
    When o componente é renderizado
    Then o texto "Erro ao salvar" deve estar no documento

  Scenario: Renderiza o alert com severidade warning
    Given um alert aberto com severidade warning e conteúdo "Atenção"
    When o componente é renderizado
    Then o texto "Atenção" deve estar no documento
