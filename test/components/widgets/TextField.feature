Feature: Componente GenericTextField

  Scenario: Renderiza com o label correto
    Given um TextField com label "E-mail"
    When o componente é renderizado
    Then o label "E-mail" deve estar no documento

  Scenario: Chama onChange ao digitar
    Given um TextField com label "Nome" e um handler onChange
    When o usuário digita "Larissa" no campo
    Then o handler onChange deve ter sido chamado

  Scenario: Exibe helperText quando fornecido
    Given um TextField com helperText "Campo obrigatório"
    When o componente é renderizado
    Then o texto "Campo obrigatório" deve estar no documento

  Scenario: Renderiza desabilitado quando disabled é true
    Given um TextField com label "Bloqueado" e disabled true
    When o componente é renderizado
    Then o input deve estar desabilitado

  Scenario: Renderiza em estado de erro quando error é true
    Given um TextField com label "Senha" e error true e helperText "Senha inválida"
    When o componente é renderizado
    Then o texto "Senha inválida" deve estar no documento
