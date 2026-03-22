Feature: Filtros do board persistidos na URL

  Background:
    Given existem cards carregados no board

  Scenario: Filtrar cards por texto
    When o filtro de texto "pagamento" é aplicado
    Then apenas cards cujo título contém "pagamento" são exibidos
    And cards sem "pagamento" no título não aparecem

  Scenario: Resetar filtros limpa os resultados
    Given o filtro de texto "pagamento" está aplicado
    When os filtros são resetados
    Then todos os cards aparecem novamente

  Scenario: Filtro de usuário exclui cards de outros usuários
    When o filtro de usuário com id "5" é aplicado
    Then apenas cards atribuídos ao usuário "5" aparecem

  Scenario: Sem filtros ativos retorna todos os cards
    When nenhum filtro está ativo
    Then todos os cards são retornados sem modificação
