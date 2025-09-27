import { UserProfile } from "@/common/model";

const MOCK_USER: UserProfile = {
  id: 1,
  firstName: "John",
  lastName: "Doe",
  username: "johndoe",
  email: "john.doe@example.com",
};

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
