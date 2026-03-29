Feature: Utilitário getSxProps

  Scenario: Retorna array vazio quando chamado sem argumento
    Given nenhum argumento é passado
    When getSxProps é chamado
    Then o resultado deve ser um array vazio

  Scenario: Retorna array vazio para undefined
    Given o argumento undefined é passado
    When getSxProps é chamado
    Then o resultado deve ser um array vazio

  Scenario: Envolve sxProps não-array em um array
    Given um objeto sxProps não-array com color "red"
    When getSxProps é chamado
    Then o resultado deve ser um array contendo o objeto

  Scenario: Retorna sxProps array sem modificação
    Given um array de sxProps com dois objetos
    When getSxProps é chamado
    Then o resultado deve ser a mesma referência do array original
