import "./authentication.css";
import { Link } from "react-router-dom";

export default function LoginPage() {
  return (
    <div>
      <form className="auth-form">
        <h1>Welcome back!</h1>

        <input className="auth-input" type="text" placeholder="Username" />

        <input className="auth-input" type="password" placeholder="Password" />

        <Link to="/forgot-password" className="right-align">
          Forgot password?
        </Link>

        <button type="submit" className="primary-btn">
          Login
        </button>

        <p>
          Don't you have an account?<Link to="/register">Sign Up</Link>
        </p>
      </form>
    </div>
  );
}
