import React, { useState, useEffect } from "react";
import {
  FaUserCircle,
  FaLock,
  FaGlobe,
  FaShareAlt,
  FaEdit,
  FaTrash,
  FaUtensils,
  FaHeart,
  FaRegHeart,
  FaBookmark,
  FaRegBookmark,
  FaTimes,
} from "react-icons/fa";
import { FiSettings, FiPlusCircle } from "react-icons/fi";
import { GiCook, GiMeal, GiFoodTruck } from "react-icons/gi";
import Navbar from "./Navbar";
import axios from "axios";

const UserProfile = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    image: "",
    isPublic: true,
  });
  const [editingPost, setEditingPost] = useState({
    id: "",
    title: "",
    content: "",
    image: "",
    isPublic: true,
  });
  const [user, setUser] = useState({});
  const [activeTab, setActiveTab] = useState("posts");
  const [isPosting, setIsPosting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [savedPosts, setSavedPosts] = useState(new Set());

  // Fetch user details and posts using token
  useEffect(() => {
    const token = localStorage.getItem("token");
    const name = localStorage.getItem("name");
    const email = localStorage.getItem("email");
    const avatar =
      localStorage.getItem("avatar") ||
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80";

    if (token) {
      setUser({ name, email, avatar });

      axios
        .get("http://localhost:8080/api/posts/byLoggedInUser", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => setPosts(res.data))
        .catch((err) => console.error("Error fetching posts:", err));
    }
  }, []);

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    setIsPosting(true);
    const token = localStorage.getItem("token");

    try {
      const res = await axios.post("http://localhost:8080/api/posts", newPost, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPosts([res.data, ...posts]);
      setNewPost({ title: "", content: "", image: "", isPublic: true });
    } catch (error) {
      console.error("Error posting:", error);
    } finally {
      setIsPosting(false);
    }
  };

  const handleEditPost = async (e) => {
    e.preventDefault();
    setIsEditing(true);
    const token = localStorage.getItem("token");

    try {
      const res = await axios.put(
        `http://localhost:8080/api/posts/${editingPost.id}`,
        {
          title: editingPost.title,
          content: editingPost.content,
          image: editingPost.image,
          isPublic: editingPost.isPublic,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPosts((prev) =>
        prev.map((post) => (post.id === res.data.id ? res.data : post))
      );
      setEditingPost({
        id: "",
        title: "",
        content: "",
        image: "",
        isPublic: true,
      });
      document.getElementById("editModal").close();
    } catch (error) {
      console.error("Error updating post:", error);
    } finally {
      setIsEditing(false);
    }
  };

  const openEditModal = (post) => {
    setEditingPost({
      id: post.id,
      title: post.title,
      content: post.content,
      image: post.image,
      isPublic: post.isPublic,
    });
    document.getElementById("editModal").showModal();
  };

  const handleToggleVisibility = async (id, currentVisibility) => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.put(
        `http://localhost:8080/api/posts/${id}/visibility`,
        { isPublic: !currentVisibility },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPosts((prev) =>
        prev.map((post) =>
          post.id === id ? { ...post, isPublic: res.data.isPublic } : post
        )
      );
    } catch (error) {
      console.error("Error updating visibility:", error);
    }
  };

  const handleDeletePost = async (id) => {
    if (window.confirm("Are you sure you want to delete this recipe post?")) {
      const token = localStorage.getItem("token");
      try {
        await axios.delete(`http://localhost:8080/api/posts/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPosts(posts.filter((post) => post.id !== id));
      } catch (error) {
        console.error("Error deleting post:", error);
      }
    }
  };

  const toggleLike = (postId) => {
    const newLikedPosts = new Set(likedPosts);
    if (newLikedPosts.has(postId)) {
      newLikedPosts.delete(postId);
    } else {
      newLikedPosts.add(postId);
    }
    setLikedPosts(newLikedPosts);
  };

  const toggleSave = (postId) => {
    const newSavedPosts = new Set(savedPosts);
    if (newSavedPosts.has(postId)) {
      newSavedPosts.delete(postId);
    } else {
      newSavedPosts.add(postId);
    }
    setSavedPosts(newSavedPosts);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-amber-50 pb-20">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-amber-400 to-amber-500 pt-16 pb-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-6 relative">
              <div className="relative -mt-16">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                />
                <button className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md hover:bg-amber-100 transition">
                  <FiSettings className="text-amber-600" />
                </button>
              </div>

              <div className="text-center md:text-left">
                <h1 className="text-3xl font-bold text-white">
                  {user.name || "Food Explorer"}
                </h1>
                <p className="text-white/90 mt-1">
                  {user.email || "explorer@foodapp.com"}
                </p>

                <div className="flex gap-4 mt-4 justify-center md:justify-start">
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 text-white flex items-center gap-2">
                    <GiCook className="text-xl" />
                    <div>
                      <p className="font-bold">{posts.length}</p>
                      <p className="text-sm">Recipes</p>
                    </div>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 text-white flex items-center gap-2">
                    <FaHeart className="text-xl" />
                    <div>
                      <p className="font-bold">1.2K</p>
                      <p className="text-sm">Followers</p>
                    </div>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 text-white flex items-center gap-2">
                    <GiMeal className="text-xl" />
                    <div>
                      <p className="font-bold">356</p>
                      <p className="text-sm">Following</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12">
          {/* Tabs */}
          <div className="flex border-b border-amber-200">
            <button
              onClick={() => setActiveTab("posts")}
              className={`px-4 py-3 font-medium text-sm flex items-center gap-2 ${
                activeTab === "posts"
                  ? "text-amber-600 border-b-2 border-amber-600"
                  : "text-amber-800 hover:text-amber-600"
              }`}
            >
              <FaUtensils /> My Recipes
            </button>
            <button
              onClick={() => setActiveTab("saved")}
              className={`px-4 py-3 font-medium text-sm flex items-center gap-2 ${
                activeTab === "saved"
                  ? "text-amber-600 border-b-2 border-amber-600"
                  : "text-amber-800 hover:text-amber-600"
              }`}
            >
              <FaBookmark /> Saved Recipes
            </button>
          </div>

          {/* New Post Card */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6 mt-6 border border-amber-100">
            <div className="flex items-center gap-3 mb-4">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <h3 className="text-lg font-semibold text-amber-800">
                Share a new recipe
              </h3>
            </div>

            <form onSubmit={handlePostSubmit} className="space-y-4">
              <input
                type="text"
                value={newPost.title}
                onChange={(e) =>
                  setNewPost({ ...newPost, title: e.target.value })
                }
                placeholder="Recipe name (e.g. 'Spicy Thai Noodles')"
                required
                className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />

              <textarea
                rows="4"
                value={newPost.content}
                onChange={(e) =>
                  setNewPost({ ...newPost, content: e.target.value })
                }
                placeholder="Ingredients and instructions..."
                required
                className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />

              <div className="flex items-center justify-between">
                <input
                  type="url"
                  value={newPost.image}
                  onChange={(e) =>
                    setNewPost({ ...newPost, image: e.target.value })
                  }
                  placeholder="Add a photo URL of your dish"
                  className="flex-1 px-4 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isPosting}
                  className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg font-medium transition flex items-center gap-2 disabled:opacity-70"
                >
                  <FiPlusCircle className="text-lg" />
                  {isPosting ? "Sharing..." : "Share Recipe"}
                </button>
              </div>
            </form>
          </div>

          {/* Posts Grid */}
          <div className="grid grid-cols-1 gap-6">
            {posts.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-amber-100">
                <GiFoodTruck className="text-5xl text-amber-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-amber-800">
                  You haven't shared any recipes yet
                </h3>
                <p className="text-amber-600 mt-2">
                  Your culinary creations deserve to be shared!
                </p>
                <button
                  onClick={() =>
                    document
                      .querySelector("form")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="mt-4 bg-amber-100 hover:bg-amber-200 text-amber-800 px-4 py-2 rounded-lg inline-flex items-center gap-2"
                >
                  <FaUtensils /> Share Your First Recipe
                </button>
              </div>
            ) : (
              posts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden transition-all hover:shadow-lg border border-amber-100"
                >
                  {post.image && (
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={
                          post.image ||
                          "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                        }
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/30 to-transparent"></div>
                    </div>
                  )}

                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-semibold text-amber-900 mb-2">
                        {post.title}
                      </h3>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            handleToggleVisibility(post.id, post.isPublic)
                          }
                          className={`p-2 rounded-full ${
                            post.isPublic
                              ? "text-green-500 hover:bg-green-50"
                              : "text-red-500 hover:bg-red-50"
                          }`}
                          title={post.isPublic ? "Make private" : "Make public"}
                        >
                          {post.isPublic ? <FaGlobe /> : <FaLock />}
                        </button>

                        <button
                          onClick={() => openEditModal(post)}
                          className="p-2 rounded-full text-amber-600 hover:bg-amber-50"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>

                        <button
                          onClick={() => handleDeletePost(post.id)}
                          className="p-2 rounded-full text-amber-600 hover:bg-red-50 hover:text-red-500"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>

                    <p className="text-amber-800 mt-2">{post.content}</p>

                    <div className="mt-4 pt-4 border-t border-amber-100 flex justify-between items-center">
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ${
                          post.isPublic
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {post.isPublic ? "Public Recipe" : "Private Recipe"}
                      </span>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => toggleLike(post.id)}
                          className="flex items-center gap-1 text-amber-600 hover:text-red-500 text-sm"
                        >
                          {likedPosts.has(post.id) ? (
                            <FaHeart className="text-red-500" />
                          ) : (
                            <FaRegHeart className="text-base" />
                          )}
                          {likedPosts.has(post.id) ? "Liked" : "Like"}
                        </button>
                        <button
                          onClick={() => toggleSave(post.id)}
                          className="flex items-center gap-1 text-amber-600 hover:text-amber-800 text-sm"
                        >
                          {savedPosts.has(post.id) ? (
                            <FaBookmark className="text-amber-700" />
                          ) : (
                            <FaRegBookmark className="text-sm" />
                          )}
                          {savedPosts.has(post.id) ? "Saved" : "Save"}
                        </button>
                        <button
                          onClick={() =>
                            alert("Share functionality coming soon!")
                          }
                          className="flex items-center gap-1 text-amber-600 hover:text-blue-500 text-sm"
                        >
                          <FaShareAlt className="text-sm" /> Share
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Edit Modal */}

        <dialog
          id="editModal"
          className="modal backdrop-blur-sm md:ml-120 rounded-2xl md:mt-20 fixed w-[600px] max-w-full"
        >
          <div className="modal-content bg-white/30 rounded-xl shadow-xl p-6 w-full h-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-amber-800">
                Edit Your Recipe
              </h3>
              <form method="dialog">
                <button className="text-amber-500 hover:text-amber-700 transition-colors">
                  <FaTimes className="text-xl" />
                </button>
              </form>
            </div>

            <form
              onSubmit={handleEditPost}
              className="grid md:grid-cols-2 gap-6"
            >
              {/* Left Column */}
              <div className="space-y-6">
                <div className="space-y-1">
                  <label
                    htmlFor="editTitle"
                    className="block text-sm font-medium text-amber-700"
                  >
                    Recipe Name
                  </label>
                  <input
                    id="editTitle"
                    type="text"
                    value={editingPost.title}
                    onChange={(e) =>
                      setEditingPost({ ...editingPost, title: e.target.value })
                    }
                    placeholder="e.g. Grandma's Apple Pie"
                    required
                    className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-amber-900"
                  />
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="editImage"
                    className="block text-sm font-medium text-amber-700"
                  >
                    Image URL (Optional)
                  </label>
                  <input
                    id="editImage"
                    type="url"
                    value={editingPost.image}
                    onChange={(e) =>
                      setEditingPost({ ...editingPost, image: e.target.value })
                    }
                    placeholder="https://example.com/your-recipe-photo.jpg"
                    className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-amber-900"
                  />
                  {editingPost.image && (
                    <div className="mt-2">
                      <p className="text-xs text-amber-600 mb-1">
                        Current Image Preview:
                      </p>
                      <img
                        src={editingPost.image}
                        alt="Recipe preview"
                        className="h-24 object-cover rounded-lg border border-amber-200"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div className="space-y-1 h-full">
                  <label
                    htmlFor="editContent"
                    className="block text-sm font-medium text-amber-700"
                  >
                    Recipe Details
                  </label>
                  <textarea
                    id="editContent"
                    rows={9}
                    value={editingPost.content}
                    onChange={(e) =>
                      setEditingPost({
                        ...editingPost,
                        content: e.target.value,
                      })
                    }
                    placeholder="Ingredients and step-by-step instructions..."
                    required
                    className="w-full h-full px-4 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-amber-900"
                  />
                </div>
              </div>

              {/* Form Buttons - span both columns */}
              <div className="modal-action flex justify-end gap-3 mt-4 md:col-span-2">
                <button
                  type="button"
                  onClick={() => document.getElementById("editModal").close()}
                  className="px-6 py-2 rounded-lg font-medium transition bg-white text-amber-700 border border-amber-300 hover:bg-amber-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isEditing}
                  className="px-6 py-2 rounded-lg font-medium transition bg-amber-600 hover:bg-amber-700 text-white flex items-center gap-2 disabled:opacity-70"
                >
                  {isEditing ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Updating...
                    </>
                  ) : (
                    "Update Recipe"
                  )}
                </button>
              </div>
            </form>
          </div>
        </dialog>
      </div>
    </>
  );
};

export default UserProfile;
