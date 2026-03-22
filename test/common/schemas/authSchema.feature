Feature: Validação de schemas de autenticação

  Scenario: Login aceita email e senha válidos
    Given dados de login com email "user@test.com" e senha "123456"
    When o loginSchema valida os dados
    Then a validação deve ter sucesso

  Scenario: Login rejeita email malformado
    Given dados de login com email "nao-é-email" e senha "123456"
    When o loginSchema valida os dados
    Then a validação deve falhar com erro no campo "email"

  Scenario: Login rejeita senha com menos de 6 caracteres
    Given dados de login com email "user@test.com" e senha "123"
    When o loginSchema valida os dados
    Then a validação deve falhar com erro no campo "password"

  Scenario: Registro aceita dados válidos
    Given dados de registro válidos
    When o registerSchema valida os dados
    Then a validação deve ter sucesso

  Scenario: Registro rejeita senhas que não coincidem
    Given dados de registro com confirmPassword divergente
    When o registerSchema valida os dados
    Then a validação deve falhar com erro de confirmPassword

  Scenario: Registro rejeita terms igual a false
    Given dados de registro com terms igual a false
    When o registerSchema valida os dados
    Then a validação deve falhar no campo terms

  Scenario: Registro rejeita username com menos de 3 caracteres
    Given dados de registro com username curto
    When o registerSchema valida os dados
    Then a validação deve falhar com erro no campo "username"

  Scenario: Registro rejeita firstName vazio
    Given dados de registro com firstName vazio
    When o registerSchema valida os dados
    Then a validação deve falhar com erro no campo "firstName"

  Scenario: Recuperação de senha aceita email válido
    Given email "user@test.com" para recuperação de senha
    When o forgotSchema valida os dados
    Then a validação deve ter sucesso

  Scenario: Recuperação de senha rejeita email malformado
    Given email "invalido" para recuperação de senha
    When o forgotSchema valida os dados
    Then a validação deve falhar

  Scenario: Alteração de senha aceita senhas que coincidem
    Given nova senha "nova123" e confirmação "nova123"
    When o changePasswordSchema valida os dados
    Then a validação deve ter sucesso

  Scenario: Alteração de senha rejeita senhas que não coincidem
    Given nova senha "nova123" e confirmação "diferente"
    When o changePasswordSchema valida os dados
    Then a validação deve falhar com erro de confirmPassword

  Scenario: Alteração de senha rejeita senha com menos de 6 caracteres
    Given nova senha "abc" e confirmação "abc"
    When o changePasswordSchema valida os dados
    Then a validação deve falhar
