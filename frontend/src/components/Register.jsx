import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/api/auth/register", {
        username,
        email,
        password,
      });
      alert("Registered successfully. Please login.");
      navigate("/login");
    } catch (err) {
      alert("Registration failed");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-r from-orange-100 to-yellow-100">
      {/* Left image section */}
      <div className="hidden lg:block w-1/2">
        <div
          className="h-full w-full bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')",
          }}
        ></div>
      </div>

      {/* Right form section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl transition-transform duration-500 hover:scale-[1.02]">
          <div className="text-center mb-6">
            <h2 className="text-4xl font-extrabold text-orange-600">Join Us</h2>
            <p className="text-gray-500 mt-2">
              Be part of our food-loving family
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            {/* Username */}
            <div className="relative">
              <FaUser className="absolute top-4 left-3 text-orange-400" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Username"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
              />
            </div>

            {/* Email */}
            <div className="relative">
              <FaEnvelope className="absolute top-4 left-3 text-orange-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Email address"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <FaLock className="absolute top-4 left-3 text-orange-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Password"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition duration-300 shadow-md"
            >
              Sign Up
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account?{" "}
            <span
              className="text-orange-600 hover:underline cursor-pointer font-medium"
              onClick={() => navigate("/login")}
            >
              Login here
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
