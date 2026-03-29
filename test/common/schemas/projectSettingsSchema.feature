Feature: Schemas de configurações do projeto

  Scenario: projectDetailsSchema aceita nome válido
    Given um payload com projectName "My Project"
    When projectDetailsSchema.safeParse é chamado
    Then o resultado deve ser sucesso

  Scenario: projectDetailsSchema rejeita nome menor que 3 caracteres
    Given um payload com projectName "AB"
    When projectDetailsSchema.safeParse é chamado
    Then o resultado deve ser falha

  Scenario: projectDetailsSchema aceita sem description
    Given um payload com apenas projectName "ABC"
    When projectDetailsSchema.safeParse é chamado
    Then o resultado deve ser sucesso

  Scenario: projectDetailsSchema aceita com description
    Given um payload com projectName "ABC" e description "A desc"
    When projectDetailsSchema.safeParse é chamado
    Then o resultado deve ser sucesso

  Scenario: newListSchema aceita nome válido
    Given um payload com name "To Do"
    When newListSchema.safeParse é chamado
    Then o resultado deve ser sucesso

  Scenario: newListSchema rejeita nome vazio
    Given um payload com name vazio
    When newListSchema.safeParse é chamado
    Then o resultado deve ser falha

  Scenario: addUserSchema aceita email válido
    Given um payload com email "user@example.com"
    When addUserSchema.safeParse é chamado
    Then o resultado deve ser sucesso

  Scenario: addUserSchema rejeita email inválido
    Given um payload com email "not-an-email"
    When addUserSchema.safeParse é chamado
    Then o resultado deve ser falha

  Scenario: addUserSchema rejeita email vazio
    Given um payload com email vazio
    When addUserSchema.safeParse é chamado
    Then o resultado deve ser falha

  Scenario: newProjectSchema aceita nome válido
    Given um payload com projectName "New Project"
    When newProjectSchema.safeParse é chamado
    Then o resultado deve ser sucesso

  Scenario: newProjectSchema aceita nome com exatamente 3 caracteres
    Given um payload com projectName de exatamente 3 caracteres "ABC"
    When newProjectSchema.safeParse é chamado
    Then o resultado deve ser sucesso

  Scenario: newProjectSchema rejeita nome com 2 caracteres
    Given um payload com projectName "AB"
    When newProjectSchema.safeParse é chamado
    Then o resultado deve ser falha
