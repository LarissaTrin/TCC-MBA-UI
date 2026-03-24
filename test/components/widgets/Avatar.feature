Feature: Componente GenericAvatar

  Scenario: Renderiza as iniciais de um nome completo
    Given um avatar com fullName "João Silva"
    When o componente é renderizado
    Then as iniciais "JS" devem estar no documento

  Scenario: Renderiza sem quebrar com nome de uma palavra
    Given um avatar com fullName "Larissa"
    When o componente é renderizado
    Then o componente deve estar no documento

  Scenario: Aplica tamanho padrão de 40px
    Given um avatar com fullName "Ana Costa" sem size definido
    When o componente é renderizado
    Then o avatar deve estar no documento

  Scenario: Aplica tamanho customizado
    Given um avatar com fullName "Carlos Lima" e size 60
    When o componente é renderizado
    Then o avatar deve estar no documento
