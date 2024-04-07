import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./authentication.css";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3000/auth/login", {
        username,
        password,
      });
      console.log(response.data);
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  return (
    <div>
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1>Welcome back!</h1>

        <input
          className="auth-input"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input
          className="auth-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <Link to="/forgot-password" className="right-align">
          Forgot password?
        </Link>

        <button type="submit" className="primary-btn">
          Login
        </button>
      </form>
      <p>
        Don't you have an account?<Link to="/register">Sign Up</Link>
      </p>
    </div>
  );
}
