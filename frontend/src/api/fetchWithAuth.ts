const API_URL = import.meta.env.VITE_API_URL;

export const fetchWithAuth = async (
  endpoint: string,
  options: RequestInit = {}
) => {
  let token = localStorage.getItem("token");

  const makeRequest = async (accessToken: string | null) => {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      ...options.headers,
    };

    return fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });
  };

  let response = await makeRequest(token);


  if (response.status === 401) {
    const refresh = localStorage.getItem("refresh");

    if (!refresh) {
      handleLogout();
      return;
    }

    try {
      const refreshRes = await fetch(`${API_URL}/token/refresh/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh }),
      });

      if (!refreshRes.ok) {
        handleLogout();
        return;
      }

      const data = await refreshRes.json();

      
      localStorage.setItem("token", data.access);

      
      response = await makeRequest(data.access);
    } catch (error) {
      handleLogout();
      return;
    }
  }

  if (!response.ok) {
    const error = await response.json();
    throw new Error(JSON.stringify(error));
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
};


function handleLogout() {
  localStorage.removeItem("token");
  localStorage.removeItem("refresh");

  alert("Session expired. Please login again.");

  window.location.href = "/login";
}