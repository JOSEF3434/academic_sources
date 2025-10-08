import { Routes, Route, Link, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Upload from "./pages/Upload.jsx";
import Analysis from "./pages/Analysis.jsx";
import Sources from "./pages/Sources.jsx";

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="text-xl font-semibold">
            Academic Sources
          </Link>
          <nav className="space-x-4">
            <Link
              className="text-sm text-gray-700 hover:text-black"
              to="/login"
            >
              Login
            </Link>
            <Link
              className="text-sm text-gray-700 hover:text-black"
              to="/register"
            >
              Register
            </Link>
            <Link
              className="text-sm text-gray-700 hover:text-black"
              to="/upload"
            >
              Upload
            </Link>
            <Link
              className="text-sm text-gray-700 hover:text-black"
              to="/sources"
            >
              Sources
            </Link>
          </nav>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-6">{children}</main>
    </div>
  );
}

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/upload" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/analysis/:id" element={<Analysis />} />
        <Route path="/sources" element={<Sources />} />
      </Routes>
    </Layout>
  );{
  /* 
  docker pull redis:7
docker pull mongo:6
docker pull n8nio/n8n:latest

  `docker run -it --rm  --name n8n  -p 5678:5678  -e GENERIC_TIMEZONE="Africa/Addis_Ababa"  -e TZ="Africa/Addis_Ababa"  -e N8N_ENFORCE_SETTINGS_FILE_PERMISSIONS=true  -e N8N_RUNNERS_ENABLED=true  -v n8n_data:/home/node/.n8n  n8nio/n8n:latest`
  */
}
}



