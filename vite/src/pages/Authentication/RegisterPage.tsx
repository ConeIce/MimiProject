import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios"; // You may need to install axios: npm install axios
import "./authentication.css";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3000/auth/register", {
        username,
        email,
        password,
      });
      console.log(response.data);
    } catch (error) {
      console.error("Error registering:", error);
    }
  };

  return (
    <div>
      {" "}
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1>Create an account</h1>

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
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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

        <button type="submit" className="primary-btn">
          Create Account
        </button>
      </form>
      <p>
        Already have an account? <Link to="/">Sign in</Link>
      </p>
    </div>
  );
}
