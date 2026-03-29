Feature: Utilitários de Dashboard

  Scenario: PRIORITY_LABEL cobre todas as 5 prioridades
    Given o mapeamento PRIORITY_LABEL
    When verifico os rótulos das prioridades 1 a 5
    Then os rótulos devem ser "Muito baixa", "Baixa", "Média", "Alta" e "Muito alta"

  Scenario: buildByListChart retorna opções de gráfico de barras
    Given um stats com duas listas "To Do" e "Done"
    When buildByListChart é chamado
    Then o tipo do gráfico deve ser "bar" com os dados e categorias corretos

  Scenario: buildByListChart colore a lista final diferente
    Given um stats com lista final "Done"
    When buildByListChart é chamado
    Then as cores devem incluir azul para lista normal e verde para lista final

  Scenario: buildByListChart lida com byList vazio
    Given um stats com byList vazio
    When buildByListChart é chamado
    Then o array de dados deve ser vazio

  Scenario: buildByPriorityChart retorna gráfico de barras com rótulos de prioridade
    Given um stats com prioridades 1, 3 e null
    When buildByPriorityChart é chamado
    Then as categorias devem conter "Muito baixa", "Média" e "Sem prioridade"

  Scenario: buildByPriorityChart ordena prioridade null por último
    Given um stats com prioridade null presente
    When buildByPriorityChart é chamado
    Then a última categoria deve ser "Sem prioridade"

  Scenario: buildByPriorityChart usa fallback para prioridade desconhecida
    Given um stats com prioridade desconhecida 9
    When buildByPriorityChart é chamado
    Then a primeira categoria deve ser "P9"

  Scenario: buildByTagChart retorna opções de gráfico donut
    Given um stats com tags "backend" e "frontend"
    When buildByTagChart é chamado
    Then o tipo deve ser "donut" com series e labels corretos

  Scenario: buildByTagChart lida com byTag vazio
    Given um stats com byTag vazio
    When buildByTagChart é chamado
    Then o array de series deve ser vazio

  Scenario: buildBurndownChart retorna gráfico de linha com duas séries
    Given um burndown com 3 pontos
    When buildBurndownChart é chamado
    Then o tipo deve ser "line" com séries "Real" e "Ideal"

  Scenario: buildBurndownChart usa datas dos pontos como categorias
    Given um burndown com datas "2026-01-01", "2026-01-02" e "2026-01-03"
    When buildBurndownChart é chamado
    Then as categorias do eixo x devem ser essas três datas

  Scenario: buildBurndownChart dados de remaining correspondem aos pontos
    Given um burndown com remaining 10, 8 e 5
    When buildBurndownChart é chamado
    Then a série Real deve ter os dados 10, 8 e 5

  Scenario: buildBurndownChart dados de ideal correspondem aos pontos
    Given um burndown com ideal 10, 7 e 4
    When buildBurndownChart é chamado
    Then a série Ideal deve ter os dados 10, 7 e 4
