import "./authentication.css";
import { Link } from "react-router-dom";

export default function ForgotPage() {
  return (
    <div>
      {" "}
      <form action="" className="auth-form">
        <h1>Forgot Password</h1>
        <p className="subtitle">
          Enter your email below to recieve a password reset link
        </p>

        <input className="auth-input" type="email" placeholder="Email" />
        <a className="primary-btn" href="#">
          Reset Password
        </a>

        <p>
          Dont' have an account? <Link to="/register">Sign up</Link>
        </p>
      </form>
    </div>
  );
}
