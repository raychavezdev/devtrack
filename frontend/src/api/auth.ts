const API_URL = import.meta.env.VITE_API_URL;

export async function loginRequest(username: string, password: string) {
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
  
  return response.json();
}

export async function registerRequest(
  username: string,
  email: string,
  password: string,
) {
  const response = await fetch(`${API_URL}/register/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      email,
      password,
    }),
  });


  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data;
}
