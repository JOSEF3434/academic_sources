import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Analysis() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchAnalysis() {
      try {
        const token = localStorage.getItem("token");
        const resp = await axios.get(`/analysis/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setData(resp.data);
      } catch (err) {
        setMessage(err.response?.data?.message || "Failed to load analysis");
      }
    }
    fetchAnalysis();
  }, [id]);

  if (message) return <p className="text-sm text-gray-600">{message}</p>;
  if (!data) return <p className="text-sm text-gray-600">Loading...</p>;

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Analysis</h1>
      <pre className="bg-gray-50 p-4 rounded border text-sm overflow-auto">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}



