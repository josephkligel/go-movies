import { useState } from "react";
import Input from "./form/Input";
import { useOutletContext } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { setJwtToken } = useOutletContext();
  const { setAlertClass } = useOutletContext();
  const { setAlertMessage } = useOutletContext();

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("email/pass", email, password);
    if (email === "admin@example.com") {
      setJwtToken("abc");
      setAlertClass("d-none");
      setAlertMessage("");
      navigate("/");
    } else {
      setAlertClass("alert-danger");
      setAlertMessage("Invalid credentials");
    }
  };

  return (
    <div className="col-md-6 offset-md-3">
      <h2>Login</h2>
      <hr />

      <form onSubmit={handleSubmit}>
        <Input
          label="Email"
          type="email"
          className="form-control"
          name="email"
          autoComplete="email-new"
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          label="Password"
          type="password"
          className="form-control"
          name="password"
          autoComplete="password-new"
          onChange={(e) => setPassword(e.target.value)}
        />

        <hr />
        <button type="submit" className="btn btn-primary">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
