import { useState } from "react";
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    try {
      const { data } = await axios.post("/auth/login", { email, password });
      localStorage.setItem("token", data.token);
      setMessage("Logged in");
    } catch (err) {
      setMessage(err.response?.data?.message || "Login failed");
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-xl font-semibold mb-4">Login</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full border rounded px-3 py-2"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="w-full bg-black text-white py-2 rounded">
          Login
        </button>
      </form>
      {message && <p className="text-sm text-gray-600 mt-3">{message}</p>}
    </div>
  );
}



