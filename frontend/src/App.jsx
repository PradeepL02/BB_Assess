import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./login & register/login";
import NotesPage from "./pages/note";
import RegisterPage from "./login & register/register";
import UserManagement from "./pages/user";

function App() {
  const token = localStorage.getItem("token");

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/user" element={<UserManagement />} />
        <Route
          path="/notes"
          element={token ? <NotesPage /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
