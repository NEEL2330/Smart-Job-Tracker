import API from "./api";

export const loginUser = async (email, password) => {
  const res = await API.post("/api/auth/login", { email, password });
  localStorage.setItem("token", res.data.access_token);
  return res.data;
};

export const registerUser = async (name, email, password) => {
  const res = await API.post("/api/auth/register", { name, email, password });
  localStorage.setItem("token", res.data.access_token);
  return res.data;
};

export const logoutUser = () => {
  localStorage.removeItem("token");
  window.location.href = "/login";
};
