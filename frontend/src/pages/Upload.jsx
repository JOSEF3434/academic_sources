import { useState } from "react";
import axios from "axios";

export default function Upload() {
  const [file, setFile] = useState(null);
  const [topic, setTopic] = useState("");
  const [academicLevel, setAcademicLevel] = useState("");
  const [message, setMessage] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    if (!file) {
      setMessage("Please select a file");
      return;
    }
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("topic", topic);
      form.append("academicLevel", academicLevel);
      const token = localStorage.getItem("token");
      const { data } = await axios.post("/upload", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage(`Uploaded. Assignment ID: ${data.id}`);
    } catch (err) {
      setMessage(err.response?.data?.message || "Upload failed");
    }
  }

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-xl font-semibold mb-4">Upload Assignment</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />
        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Academic Level"
          value={academicLevel}
          onChange={(e) => setAcademicLevel(e.target.value)}
        />
        <button className="w-full bg-black text-white py-2 rounded">
          Upload
        </button>
      </form>
      {message && <p className="text-sm text-gray-600 mt-3">{message}</p>}
    </div>
  );
}



