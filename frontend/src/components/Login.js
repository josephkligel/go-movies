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
    
    // build the request payload
    let payload = {
      email: email,
      password: password,      
    }

    const requestOptions = {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(payload),
    }
    fetch(`/authenticate`, requestOptions)
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          setAlertClass("alert-danger")
          setAlertMessage(data.message)
        } else {
          setJwtToken(data.access_token)
          setAlertClass("d-none")
          setAlertMessage("")
          navigate("/")
        }
      })
      .catch(error => {
        setAlertClass("alert-danger")
        setAlertMessage(error)
      })
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
