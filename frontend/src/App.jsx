import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import LearningPlans from "./components/LearningPlans";
import LearningPlanDetails from "./components/LearningPlanDetails";
import CreateLearningPlan from "./components/CreateLearningPlan";
import UpdatePlanDetails from "./components/UpdateLearningPlan";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";

function App() {
  return (
    <Router>
      <>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/learning" element={<LearningPlans />} />
          <Route path="/learning-plan/:id" element={<LearningPlanDetails />} />
          <Route
            path="/edit-learning-plan/:id"
            element={<UpdatePlanDetails />}
          />
          <Route
            path="/create-learning-plan"
            element={<CreateLearningPlan />}
          />
        </Routes>
        <ToastContainer position="top-right" autoClose={3000} />
      </>
    </Router>
  );
}

export default App;