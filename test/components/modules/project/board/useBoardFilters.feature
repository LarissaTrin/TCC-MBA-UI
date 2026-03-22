Feature: Filtros do board persistidos em URL

  Scenario: Retorna todas as tasks quando nenhum filtro está ativo
    Given um conjunto de tasks carregadas sem filtros na URL
    When useBoardFilters é renderizado
    Then filteredTasks deve conter todas as tasks

  Scenario: isFiltered é false quando não há filtros aplicados
    Given um conjunto de tasks carregadas sem filtros na URL
    When useBoardFilters é renderizado
    Then isFiltered deve ser false

  Scenario: Filtra tasks por texto via parâmetro search na URL
    Given tasks com títulos "Tela pagamento" e "Dashboard admin"
    And o parâmetro search "pagamento" está na URL
    When useBoardFilters é renderizado
    Then filteredTasks deve conter apenas a task "Tela pagamento"

  Scenario: isFiltered é true quando há parâmetro search na URL
    Given o parâmetro search "algo" está na URL
    When useBoardFilters é renderizado com qualquer lista de tasks
    Then isFiltered deve ser true

  Scenario: handleApply atualiza a URL com os parâmetros do formulário
    Given um conjunto de tasks carregadas sem filtros na URL
    When handleApply é chamado com search "meu filtro"
    Then router.replace deve ser chamado com "search=meu+filtro" na URL

  Scenario: resetFilters remove parâmetros de filtro preservando tab
    Given filtros ativos "search=algo" e parâmetro "tab=board" na URL
    When resetFilters é chamado
    Then router.replace deve ser chamado sem "search=" mas com "tab=board"

  Scenario: Filtra tasks por usuário via parâmetro users na URL
    Given tasks atribuídas aos usuários com id 5 e id 6
    And o parâmetro users "5" está na URL
    When useBoardFilters é renderizado
    Then filteredTasks deve conter apenas a task do usuário 5
