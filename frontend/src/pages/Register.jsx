import { useState } from "react";
import axios from "axios";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [message, setMessage] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    try {
      await axios.post("/auth/register", {
        email,
        password,
        fullName,
        studentId,
      });
      setMessage("Registered. You can login now");
    } catch (err) {
      setMessage(err.response?.data?.message || "Registration failed");
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-xl font-semibold mb-4">Register</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Full name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Student ID"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
        />
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
          Register
        </button>
      </form>
      {message && <p className="text-sm text-gray-600 mt-3">{message}</p>}
    </div>
  );
}



