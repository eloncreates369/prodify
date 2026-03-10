const API = "http://localhost:5000";

/* REGISTER */

export async function register(email, password) {

  const res = await fetch(`${API}/api/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password })
  });

  return await res.json();
}


/* LOGIN */

export async function login(email, password) {

  const res = await fetch(`${API}/api/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  if (data.token) {
    localStorage.setItem("token", data.token);
  }

  return data;
}


/* GET TOKEN */

export function getToken(){
  return localStorage.getItem("token");
}


/* LOGOUT */

export function logout(){
  localStorage.removeItem("token");
}