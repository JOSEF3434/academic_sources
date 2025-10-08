import { useState } from "react";
import axios from "axios";

export default function Sources() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState("");

  async function onSearch(e) {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const resp = await axios.get(`/sources?q=${encodeURIComponent(q)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setResults(resp.data.results || []);
    } catch (err) {
      setMessage(err.response?.data?.message || "Search failed");
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={onSearch} className="flex gap-2 mb-4">
        <input
          className="flex-1 border rounded px-3 py-2"
          placeholder="Search academic sources"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button className="bg-black text-white px-4 rounded">Search</button>
      </form>
      <ul className="space-y-2">
        {results.map((r, idx) => (
          <li key={idx} className="bg-white p-3 rounded border">
            <div className="font-medium">{r.title}</div>
            <div className="text-sm text-gray-600">
              {r.publication_year || r.publicationYear} • {r.authors}
            </div>
          </li>
        ))}
      </ul>
      {message && <p className="text-sm text-gray-600 mt-3">{message}</p>}
    </div>
  );
}



