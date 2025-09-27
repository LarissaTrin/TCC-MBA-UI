import { UserProfile } from "@/common/model";
import { MOCK_USER } from "../mock";

export async function getProfile(): Promise<UserProfile> {
  console.log("API: Buscando dados do perfil...");
  await new Promise((resolve) => setTimeout(resolve, 800));
  console.log("API: Dados retornados:", MOCK_USER);
  return MOCK_USER;
}

export async function updateProfile(data: Partial<UserProfile>): Promise<void> {
  console.log("API: Salvando dados do perfil...", data);
  await new Promise((resolve) => setTimeout(resolve, 1500));
  console.log("API: Perfil atualizado com sucesso!");
}

export async function updatePassword(data: {
  password?: string;
}): Promise<void> {
  if (!data.password) {
    console.log("API: Nenhuma senha fornecida para atualização.");
    return;
  }
  console.log("API: Atualizando a senha...");
  await new Promise((resolve) => setTimeout(resolve, 1500));
  console.log("API: Senha atualizada com sucesso!");
}
