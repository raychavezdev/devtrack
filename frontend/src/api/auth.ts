const API_URL = import.meta.env.VITE_API_URL;

export const loginRequest = async (username: string, password: string) => {
  const response = await fetch(`${API_URL}/token/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
    }),
  });

  if (!response.ok) throw new Error("Invalid credentials");
  console.log(response)
  return response.json();
};