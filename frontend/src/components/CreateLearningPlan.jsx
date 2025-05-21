import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { createClient } from "@supabase/supabase-js";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Initialize Supabase client
const supabaseUrl = "https://ikooiqeerabavauzgeeo.supabase.co"; // Replace with your Supabase project URL
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlrb29pcWVlcmFiYXZhdXpnZWVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ1MzQ3OTMsImV4cCI6MjA2MDExMDc5M30.ao4h_29v83Fyt6l2GfMN60zsj69JYy6nScmaaoCyqzo"; // Replace with your Supabase anon key
const supabase = createClient(supabaseUrl, supabaseKey);

const CreateLearningPlan = () => {
  const navigate = useNavigate();
  const [plan, setPlan] = useState({
    title: "",
    goal: "",
    skills: "",
    image: "", // Will store the Supabase image URL after upload
    steps: [{ topic: "", resources: "", timeline: "" }],
  });
  const [file, setFile] = useState(null); // State for the selected file
  const [uploading, setUploading] = useState(false); // State for upload status

  const handleStepChange = (index, field, value) => {
    const updatedSteps = [...plan.steps];
    updatedSteps[index][field] = value;
    setPlan({ ...plan, steps: updatedSteps });
  };

  const handleImageUpload = async (file) => {
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}_${Math.random()
        .toString(36)
        .slice(2)}.${fileExt}`; // Unique file name
      const filePath = `learning-plans/${fileName}`; // Folder structure in bucket

      // Upload file to Supabase storage
      const { data, error } = await supabase.storage
        .from("foodies")
        .upload(filePath, file);

      if (error) {
        console.error("Error uploading image:", error);
        alert("Failed to upload image.");
        setUploading(false);
        return;
      }

      // Get the public URL of the uploaded image
      const { data: publicUrlData } = supabase.storage
        .from("foodies")
        .getPublicUrl(filePath);

      const imageUrl = publicUrlData.publicUrl;
      setPlan({ ...plan, image: imageUrl });
      setFile(file); // Keep file in state for preview
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("An unexpected error occurred during image upload.");
    } finally {
      setUploading(false);
    }
  };

  const addStep = () => {
    setPlan({
      ...plan,
      steps: [...plan.steps, { topic: "", resources: "", timeline: "" }],
    });
  };

  const removeStep = (index) => {
    const updatedSteps = plan.steps.filter((_, i) => i !== index);
    setPlan({ ...plan, steps: updatedSteps });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("No token found. Please log in.");
      return;
    }

    const learningPlanData = {
      title: plan.title,
      goal: plan.goal,
      skills: plan.skills,
      image: plan.image,
      steps: plan.steps,
    };

    const toastId = toast.loading("Creating your learning plan...");

    try {
      const response = await axios.post(
        "http://localhost:8080/api/learningplans",
        learningPlanData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.update(toastId, {
        render: "Learning plan created successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });

      console.log("Learning Plan Created:", response.data);
      navigate("/learning");
    } catch (error) {
      console.error("Error creating learning plan:", error);
      toast.update(toastId, {
        render: "There was an error creating your learning plan.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  return (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="min-h-screen bg-gradient-to-tr from-[#E0F7FA] via-[#FFF3E0] to-[#FFE0B2] flex justify-center items-center p-6">
        <div className="w-full max-w-5xl bg-white p-10 rounded-3xl shadow-2xl">
          <h2 className="text-4xl font-bold text-center text-[#F97316] mb-10">
            🧠 Create Your Professional Learning Plan
          </h2>

          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Plan Basic Details */}
            <section className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  Plan Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={plan.title}
                  onChange={(e) => setPlan({ ...plan, title: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-300"
                  placeholder="E.g., Mastering Italian Cuisine"
                  required
                />
              </div>

              {/* Goal */}
              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  Main Goal <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={plan.goal}
                  onChange={(e) => setPlan({ ...plan, goal: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-300"
                  placeholder="Describe the main goal in 1-2 sentences..."
                  rows={3}
                  required
                />
              </div>

              {/* Skills Learned */}
              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  Skills to Learn <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={plan.skills}
                  onChange={(e) => setPlan({ ...plan, skills: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-300"
                  placeholder="E.g., Pasta Making, Italian Sauces, Plating Techniques"
                  required
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  Upload Image (optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e.target.files[0])}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-300"
                  disabled={uploading}
                />
                {uploading && (
                  <p className="text-gray-500 mt-2">Uploading...</p>
                )}
                {plan.image && (
                  <div className="mt-4">
                    <img
                      src={plan.image}
                      alt="Plan Preview"
                      className="h-40 object-cover rounded-lg mx-auto shadow"
                    />
                  </div>
                )}
              </div>
            </section>

            {/* Plan Steps */}
            <section>
              <h3 className="text-2xl font-semibold text-[#4B5563] mb-6">
                📚 Plan Topics & Resources
              </h3>

              <div className="space-y-8">
                {plan.steps.map((step, index) => (
                  <div
                    key={index}
                    className="border border-orange-200 rounded-xl p-6 bg-orange-50 relative space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-gray-700">
                        Step {index + 1}
                      </h4>
                      {plan.steps.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeStep(index)}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <input
                        type="text"
                        placeholder="Topic Name"
                        value={step.topic}
                        onChange={(e) =>
                          handleStepChange(index, "topic", e.target.value)
                        }
                        className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-300"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Resources (links, books, videos)"
                        value={step.resources}
                        onChange={(e) =>
                          handleStepChange(index, "resources", e.target.value)
                        }
                        className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-300"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Estimated Timeline (e.g., 1 week)"
                        value={step.timeline}
                        onChange={(e) =>
                          handleStepChange(index, "timeline", e.target.value)
                        }
                        className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-300 col-span-2"
                        required
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 text-right">
                <button
                  type="button"
                  onClick={addStep}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  ➕ Add Another Topic
                </button>
              </div>
            </section>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-8">
              <button
                type="button"
                onClick={() => navigate("/learning")}
                className="px-5 py-2 rounded-lg border border-gray-400 text-gray-700 hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 rounded-lg bg-[#F97316] text-white font-semibold hover:bg-[#FF9F00] transition"
                disabled={uploading}
              >
                Save Plan
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateLearningPlan;
