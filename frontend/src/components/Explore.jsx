import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { createClient } from "@supabase/supabase-js";
import {
  PhotographIcon,
  VideoCameraIcon,
  TrashIcon,
  UploadIcon,
  XIcon,
  UserIcon,
  ThumbUpIcon,
  ChatAltIcon,
  ShareIcon,
} from "@heroicons/react/outline";
import Navbar from "./Navbar";

const API_URL = "http://localhost:8080/api/status";

const supabaseUrl = "https://ikooiqeerabavauzgeeo.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlrb29pcWVlcmFiYXZhdXpnZWVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ1MzQ3OTMsImV4cCI6MjA2MDExMDc5M30.ao4h_29v83Fyt6l2GfMN60zsj69JYy6nScmaaoCyqzo";

const supabase = createClient(supabaseUrl, supabaseKey);

const Explore = () => {
  const [statuses, setStatuses] = useState([]);
  const [formData, setFormData] = useState({
    userEmail: "",
    username: "",
    mediaUrl: "",
    description: "",
    mediaType: "IMAGE",
  });
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const videoRefs = useRef({});

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const emailFromToken = decoded.email || decoded.sub || "";
        const usernameFromToken =
          decoded.username || decoded.preferred_username || decoded.name || "";
        setFormData((prev) => ({
          ...prev,
          userEmail: emailFromToken,
          username: usernameFromToken,
        }));
      } catch (err) {
        console.error("Failed to decode token", err);
      }
    }
    fetchStatuses();
  }, []);

  const fetchStatuses = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/all`);
      setStatuses(res.data);
    } catch (err) {
      setError("Failed to fetch statuses");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setMediaFile(file);
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setMediaPreview(previewUrl);
    } else {
      setMediaPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.userEmail || !mediaFile || !formData.username) {
      setError("Media file and username are required");
      return;
    }

    try {
      setLoading(true);
      const fileExt = mediaFile.name.split(".").pop();
      const filePath = `status/${Date.now()}-${mediaFile.name}`;

      const { error: uploadError } = await supabase.storage
        .from("foodies")
        .upload(filePath, mediaFile);

      if (uploadError) throw uploadError;

      const { data: publicURLData } = supabase.storage
        .from("foodies")
        .getPublicUrl(filePath);

      const newForm = {
        ...formData,
        mediaUrl: publicURLData.publicUrl,
      };

      await axios.post(`${API_URL}/create`, newForm);

      setFormData((prev) => ({
        ...prev,
        mediaUrl: "",
        description: "",
        mediaType: "IMAGE",
      }));
      setMediaFile(null);
      setMediaPreview(null);
      setIsModalOpen(false);
      fetchStatuses();
    } catch (err) {
      console.error(err);
      setError("Failed to create status");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setError("");
    try {
      setLoading(true);
      await axios.delete(`${API_URL}/delete/${id}`);
      fetchStatuses();
    } catch (err) {
      setError("Failed to delete status");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusClick = (status) => {
    setSelectedStatus(status);
  };

  const handleVideoHover = (id, play) => {
    const video = videoRefs.current[id];
    if (video) {
      if (play) {
        video.play().catch((err) => console.error("Error playing video:", err));
      } else {
        video.pause();
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Create Status Button */}
        <div className="mb-8">
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <UploadIcon className="h-5 w-5 mr-2" />
            Create New Story
          </button>
        </div>

        {/* Modal for Create Status */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-lg relative">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                <XIcon className="h-6 w-6" />
              </button>
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Share a New Story
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <input
                  type="hidden"
                  name="userEmail"
                  value={formData.userEmail}
                />
                <input
                  type="hidden"
                  name="username"
                  value={formData.username}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <PhotographIcon className="h-5 w-5 inline-block mr-2" />
                    Upload Media
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      {mediaPreview ? (
                        <div className="mt-2">
                          {formData.mediaType === "IMAGE" ? (
                            <img
                              src={mediaPreview}
                              alt="Preview"
                              className="mx-auto h-32 w-32 object-cover rounded-md"
                            />
                          ) : (
                            <video
                              src={mediaPreview}
                              className="mx-auto h-32 w-32 object-cover rounded-md"
                              controls
                            />
                          )}
                          <p className="text-sm text-green-600 mt-2">
                            File uploaded successfully!
                          </p>
                        </div>
                      ) : (
                        <>
                          <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
                          <div className="flex text-sm text-gray-600">
                            <label
                              htmlFor="file-upload"
                              className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                            >
                              <span>Upload a file</span>
                              <input
                                id="file-upload"
                                type="file"
                                className="sr-only"
                                onChange={handleFileChange}
                                accept="image/*,video/*"
                              />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs text-gray-500">
                            PNG, JPG, MP4 up to 3MB
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="What's on your mind?"
                  />
                </div>

                <div>
                  <label
                    htmlFor="mediaType"
                    className="block text-sm font-medium text-gray-700"
                  >
                    <VideoCameraIcon className="h-5 w-5 inline-block mr-2" />
                    Media Type
                  </label>
                  <select
                    id="mediaType"
                    name="mediaType"
                    value={formData.mediaType}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  >
                    <option value="IMAGE">Image</option>
                    <option value="VIDEO">Video</option>
                  </select>
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                      loading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {loading ? (
                      <svg
                        className="animate-spin h-5 w-5 mr-2 text-white"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                    ) : null}
                    {loading ? "Creating..." : "Share Story"}
                  </button>
                </div>
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
              </form>
            </div>
          </div>
        )}

        {/* Status Modal */}
        {selectedStatus && (
          <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Close Button (top right) */}
              <button
                onClick={() => setSelectedStatus(null)}
                className="absolute top-4 right-4 bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition-all duration-200 focus:outline-none"
                aria-label="Close status"
              >
                <XIcon className="h-6 w-6 text-white" />
              </button>

              {/* Status Content */}
              <div className="max-w-4xl w-full max-h-[90vh] flex flex-col">
                {/* Media Container */}
                <div className="flex-1 flex items-center justify-center overflow-hidden">
                  {selectedStatus.mediaType === "IMAGE" ? (
                    <img
                      src={selectedStatus.mediaUrl}
                      alt="status media"
                      className="max-w-full max-h-[80vh] object-contain rounded-md"
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <video
                      autoPlay
                      controls
                      className="max-w-full max-h-[80vh] object-contain rounded-md"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <source src={selectedStatus.mediaUrl} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  )}
                </div>

                {/* User Info and Actions */}
                <div className="bg-black bg-opacity-50 text-white p-4 rounded-b-md">
                  <div className="flex items-center space-x-3">
                    {/* User Avatar */}
                    <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center overflow-hidden">
                      {selectedStatus.userAvatar ? (
                        <img
                          src={selectedStatus.userAvatar}
                          alt={selectedStatus.username}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <UserIcon className="h-5 w-5 text-white" />
                      )}
                    </div>

                    <div className="flex-1">
                      <p className="font-semibold">{selectedStatus.username}</p>
                      <p className="text-xs text-gray-300">
                        {new Date(selectedStatus.timestamp).toLocaleString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </p>
                    </div>

                    {/* Additional actions like like, comment, share */}
                    <div className="flex space-x-3">
                      <button className="text-white hover:text-gray-300">
                        <ThumbUpIcon className="h-5 w-5" />
                      </button>
                      <button className="text-white hover:text-gray-300">
                        <ChatAltIcon className="h-5 w-5" />
                      </button>
                      <button className="text-white hover:text-gray-300">
                        <ShareIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  {/* Status Description */}
                  {selectedStatus.description && (
                    <div className="mt-3 text-sm">
                      <p>{selectedStatus.description}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stories Section */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Stories</h2>
        {loading && (
          <div className="flex justify-center">
            <svg
              className="animate-spin h-8 w-8 text-blue-600"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          </div>
        )}
        {!loading && statuses.length === 0 && (
          <p className="text-gray-500 text-center">No stories found.</p>
        )}
        <div className="flex flex-wrap gap-6">
          {statuses.map((status) => (
            <div
              key={status.id}
              className="relative w-48 h-72 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
              onClick={() => handleStatusClick(status)}
              onMouseEnter={() =>
                status.mediaType === "VIDEO" &&
                handleVideoHover(status.id, true)
              }
              onMouseLeave={() =>
                status.mediaType === "VIDEO" &&
                handleVideoHover(status.id, false)
              }
            >
              {status.mediaType === "IMAGE" ? (
                <img
                  src={status.mediaUrl}
                  alt="story media"
                  className="w-full h-full object-cover"
                />
              ) : (
                <video
                  ref={(el) => (videoRefs.current[status.id] = el)}
                  muted
                  className="w-full h-full object-cover"
                >
                  <source src={status.mediaUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-3">
                <p className="text-white text-sm font-medium truncate">
                  {status.username}
                </p>
                <p className="text-white text-xs truncate">
                  {new Date(status.timestamp).toLocaleTimeString()}
                </p>
              </div>
              {status.userEmail === formData.userEmail && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(status.id);
                  }}
                  disabled={loading}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700 bg-white/80 rounded-full p-1"
                  title="Delete Story"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              )}
              {status.description && (
                <div className="absolute top-2 left-2 bg-white/80 text-gray-800 text-xs p-2 rounded-md max-w-[80%]">
                  {status.description}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Explore;
