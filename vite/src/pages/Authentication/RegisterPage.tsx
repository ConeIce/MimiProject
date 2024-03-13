import { Link } from "react-router-dom";
import "./authentication.css";

export default function RegisterPage() {
  return (
    <div>
      {" "}
      <form className="auth-form">
        <h1>Create an account</h1>

        <input className="auth-input" type="text" placeholder="Username" />

        <input className="auth-input" type="email" placeholder="Email" />

        <input className="auth-input" type="password" placeholder="Password" />

        <button type="submit" className="primary-btn">
          Create Account
        </button>

        <p>
          Already have an account? <Link to="/">Sign in</Link>
        </p>
      </form>
    </div>
  );
}
