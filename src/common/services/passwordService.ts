export async function requestPasswordReset(email: string): Promise<void> {
  console.log(`API: Solicitando reset de senha para o email: ${email}`);

  await new Promise((resolve) => setTimeout(resolve, 1500));
  console.log("API: Email de reset enviado com sucesso (simulado).");
}

export async function resetPassword(
  token: string,
  password: string
): Promise<void> {
  console.log(`API: Redefinindo senha com o token: ${token}`);
  console.log(`API: Nova senha: ${password}`);

  await new Promise((resolve) => setTimeout(resolve, 1500));
  console.log("API: Senha redefinida com sucesso (simulado).");
}
