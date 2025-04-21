import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode"; // using named export

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8080/api/auth/login", {
        email,
        password,
      });

      const token = res.data.token;
      const welcomeMsg = res.data.message || "";
      const usernameMatch = welcomeMsg.match(/Welcome back,\s*(.+)!/);
      const username = usernameMatch ? usernameMatch[1] : "User";

      localStorage.setItem("token", token);
      localStorage.setItem("username", username);
      navigate("/");
    } catch (err) {
      alert("Login failed");
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const token = credentialResponse.credential;
      const decoded = jwtDecode(token);

      console.log("Google user:", decoded);

      const res = await axios.post("http://localhost:8080/api/auth/google", {
        token,
      });

      const jwt = res.data.token;
      const welcomeMsg = res.data.message || "";
      const usernameMatch = welcomeMsg.match(/Welcome back,\s*(.+)!/);
      const username = usernameMatch ? usernameMatch[1] : "User";

      localStorage.setItem("token", jwt);
      localStorage.setItem("username", username);
      navigate("/");
    } catch (err) {
      alert("Google login failed");
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br />
        <button type="submit">Login</button>
      </form>

      <hr />
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={() => alert("Google login failed")}
      />
    </div>
  );
};

export default Login;
