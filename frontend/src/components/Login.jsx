import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
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
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email);
      }
      navigate("/");
    } catch (err) {
      alert("Login failed");
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const token = credentialResponse.credential;
      const decoded = jwtDecode(token);

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
    <div className="min-h-screen flex bg-white">
      {/* Left side with image */}
      <div className="hidden lg:block w-1/2 bg-gray-100">
        <div
          className="h-full w-full bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')",
          }}
        ></div>
      </div>

      {/* Right side with login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8 py-12">
        <div className="max-w-md w-full bg-gradient-to-br from-orange-50 via-white to-orange-100 p-8 rounded-2xl shadow-xl space-y-6">
          <div className="text-center">
            <h2 className="text-4xl font-extrabold text-gray-800">
              Welcome Back
            </h2>
            <p className="text-gray-500 mt-2 text-sm">
              Sign in to your food community account
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center justify-between text-sm text-gray-600">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="mr-2 h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                />
                Remember me
              </label>
              <a
                href="#"
                className="text-orange-600 hover:underline font-medium"
              >
                Forgot Password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-xl transition duration-300 shadow-md"
            >
              Login
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                or continue with
              </span>
            </div>
          </div>

          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => alert("Google login failed")}
              useOneTap
              theme="filled_blue"
              shape="pill"
              size="large"
              text="continue_with"
            />
          </div>

          <p className="text-center text-sm text-gray-600">
            Don’t have an account?{" "}
            <span
              className="text-orange-600 hover:underline font-medium cursor-pointer"
              onClick={() => navigate("/register")}
            >
              Sign up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
