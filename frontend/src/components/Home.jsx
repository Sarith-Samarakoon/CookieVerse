import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { toast } from "react-toastify";

const Home = () => {
  const [username, setUsername] = useState("");
  const [foodCommunities, setFoodCommunities] = useState([]);
  const [publicPosts, setPublicPosts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newCommunity, setNewCommunity] = useState({
    name: "",
    description: "",
  });
  const [commentContent, setCommentContent] = useState("");
  const [editingComment, setEditingComment] = useState({
    id: null,
    content: "",
  });
  const [showEditForm, setShowEditForm] = useState(null);

  const [showCommentBox, setShowCommentBox] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const usersToFollow = [
    { id: 1, name: "Alice 🍳", specialty: "Home Cooking" },
    { id: 2, name: "Bob 🍜", specialty: "Asian Cuisine" },
    { id: 3, name: "Charlie 🍕", specialty: "Italian Food" },
    { id: 4, name: "Dana 🥗", specialty: "Healthy Eating" },
  ];

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    setUsername(storedUsername || "Foodie");
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([fetchCommunities(), fetchPublicPosts()]);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCommunities = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/communities");
      setFoodCommunities(response.data);
    } catch (error) {
      console.error("Error fetching communities:", error);
    }
  };

  const fetchPublicPosts = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:8080/api/posts/public",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const postsWithDetails = await Promise.all(
        response.data.map(async (post) => {
          const [likesResponse, commentsResponse, userLikeResponse] =
            await Promise.all([
              axios.get(
                `http://localhost:8080/api/likecomment/likes/count/${post.id}`,
                {
                  headers: { Authorization: `Bearer ${token}` },
                }
              ),
              axios.get(
                `http://localhost:8080/api/likecomment/comments/${post.id}`,
                {
                  headers: { Authorization: `Bearer ${token}` },
                }
              ),
              axios.get(
                `http://localhost:8080/api/likecomment/user-like/${post.id}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                    userId: token,
                  },
                }
              ),
            ]);

          return {
            ...post,
            likeCount: likesResponse.data,
            comments: commentsResponse.data,
            likedByUser: userLikeResponse.data.liked,
          };
        })
      );

      setPublicPosts(postsWithDetails);
    } catch (error) {
      console.error("Error fetching public posts:", error);
    }
  };

  const handleLikeToggle = async (postId) => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");

    if (!token || !username) {
      console.error("Token or Username is missing!");
      return;
    }

    try {
      await axios.post(
        `http://localhost:8080/api/likecomment/toggle-like/${postId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            userId: token,
            username: username,
          },
        }
      );
      fetchPublicPosts();
    } catch (error) {
      console.error("Error toggling like:", error);
      if (error.response?.status === 403) {
        alert("You are not authorized to like this post.");
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    window.location.href = "/login";
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8080/api/communities",
        newCommunity
      );
      setFoodCommunities([...foodCommunities, response.data]);
      setNewCommunity({ name: "", description: "" });
      setShowForm(false);
    } catch (error) {
      console.error("Error creating community:", error);
      alert("Failed to create the community. Please try again later.");
    }
  };

  const handleComment = (postId) => {
    setShowCommentBox(postId === showCommentBox ? null : postId);
  };

  const handleCommentSubmit = async (e, postId) => {
    e.preventDefault();

    if (!commentContent.trim()) {
      alert("Please enter a comment.");
      return;
    }

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const username = localStorage.getItem("username");

    if (!username || !userId) {
      alert("User information is missing. Please log in again.");
      return;
    }

    try {
      await axios.post(
        `http://localhost:8080/api/likecomment/comment/${postId}`,
        commentContent,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            userId: userId,
            username: username,
            "Content-Type": "text/plain",
          },
        }
      );

      setCommentContent("");
      setShowCommentBox(null);
      fetchPublicPosts();
    } catch (error) {
      console.error("Error adding comment:", error);
      alert("Failed to add comment. Please try again later.");
    }
  };

  const handleEditClick = (comment) => {
    setEditingComment({ id: comment.id, content: comment.content });
    setShowEditForm(comment.id);
  };

  const handleEditChange = (e) => {
    setEditingComment((prev) => ({ ...prev, content: e.target.value }));
  };

  const handleEditSubmit = async (e, postId, Id) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    // Get the logged-in user's ID (ensure it's stored in localStorage or some global state)
    const userId = localStorage.getItem("userId");

    if (!userId) {
      toast.error("User is not logged in or user ID not found.");
      return;
    }

    try {
      await axios.put(
        `http://localhost:8080/api/likecomment/comment/${Id}`,
        editingComment.content,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "text/plain",
            userId: userId, // Add the userId to the headers
          },
        }
      );
      setShowEditForm(null);
      setEditingComment({ id: null, content: "" });
      fetchPublicPosts(); // Refresh comments
      toast.success("Comment updated successfully!"); // Success toast message
    } catch (error) {
      console.error("Error updating comment:", error);
      toast.error("Failed to update comment."); // Error toast message
    }
  };

  const handleDeleteComment = async (postId, Id) => {
    const userId = localStorage.getItem("userId");

    try {
      await axios.delete(
        `http://localhost:8080/api/likecomment/comment/${Id}`,
        {
          headers: {
            userId: userId,
          },
        }
      );
      toast.success("Comment deleted successfully!");
      fetchPublicPosts(); // Refresh comments
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error("Failed to delete comment.");
    }
  };

  const handleCommentChange = (e) => {
    setCommentContent(e.target.value);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-ts-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-[#FFFBF2] via-[#FFDCB9] to-[#ffaa6b] p-4 md:p-10 font-sans">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-start gap-6 flex-col lg:flex-row">
            {/* Left Column - User Profile & Suggestions */}
            <div className="lg:w-1/4 w-full">
              <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-orange-200 flex items-center justify-center text-2xl font-bold text-orange-600">
                    {username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                      Welcome, {username}
                    </h1>
                    <p className="text-gray-500">Food Enthusiast</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-2 px-5 rounded-lg shadow-md hover:from-red-600 hover:to-red-700 transition-all"
                >
                  Logout
                </button>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="bg-orange-100 text-orange-600 p-2 rounded-full">
                    👥
                  </span>
                  Suggested Foodies
                </h2>
                <ul className="space-y-3">
                  {usersToFollow.map((user) => (
                    <li
                      key={user.id}
                      className="flex items-center justify-between p-3 hover:bg-orange-50 rounded-lg transition-colors"
                    >
                      <div>
                        <p className="font-medium text-gray-800">{user.name}</p>
                        <p className="text-xs text-gray-500">
                          {user.specialty}
                        </p>
                      </div>
                      <button className="bg-orange-100 text-orange-600 text-sm px-3 py-1 rounded-md hover:bg-orange-200 transition-colors">
                        Follow
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Center Column - Posts */}
            <div className="lg:w-2/4 w-full">
              <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <span className="bg-orange-100 text-orange-600 p-2 rounded-full">
                    🥘
                  </span>
                  Latest Food Posts
                </h2>
                <p className="text-gray-500 mb-4">
                  Discover what the community is cooking
                </p>
              </div>

              <div className="space-y-6">
                {publicPosts.map((post) => (
                  <div
                    key={post.id}
                    className="bg-white rounded-xl shadow-md overflow-hidden transition-all hover:shadow-lg"
                  >
                    {/* Post Header */}
                    <div className="p-4 border-b border-gray-100 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-orange-200 flex items-center justify-center text-sm font-bold text-orange-600">
                        {post.username?.charAt(0).toUpperCase() || "F"}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          {post.username || "Anonymous Foodie"}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {post.createdAt &&
                            formatDistanceToNow(new Date(post.createdAt), {
                              addSuffix: true,
                            })}
                        </p>
                      </div>
                    </div>

                    {/* Post Image */}
                    {post.image && (
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-72 object-cover"
                      />
                    )}

                    {/* Post Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 mb-4 whitespace-pre-line">
                        {post.content}
                      </p>

                      {/* Like and Comment Buttons */}
                      <div className="flex items-center justify-between border-t border-b border-gray-100 py-3">
                        <button
                          onClick={() => handleLikeToggle(post.id)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                            post.likedByUser
                              ? "text-red-500 bg-red-50 hover:bg-red-100"
                              : "text-gray-600 hover:bg-gray-100"
                          }`}
                        >
                          {post.likedByUser ? (
                            <>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              Liked
                            </>
                          ) : (
                            <>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                />
                              </svg>
                              Like
                            </>
                          )}
                        </button>
                        <span className="text-gray-500">
                          {post.likeCount} likes
                        </span>

                        <button
                          onClick={() => handleComment(post.id)}
                          className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                            />
                          </svg>
                          Comment
                        </button>
                      </div>

                      {/* Comments Section */}
                      <div className="mt-4">
                        <h4 className="font-medium text-gray-700 mb-2">
                          Comments ({post.comments?.length || 0})
                        </h4>

                        {/* Existing Comments */}
                        {post.comments && post.comments.length > 0 ? (
                          <div className="space-y-3">
                            {post.comments.map((comment) => (
                              <div
                                key={comment.id}
                                className="flex items-start gap-3"
                              >
                                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-xs font-bold text-orange-600 mt-1">
                                  {comment.username?.charAt(0).toUpperCase() ||
                                    "U"}
                                </div>
                                <div className="flex-1 bg-gray-50 p-3 rounded-lg">
                                  <div className="flex justify-between items-start">
                                    <span className="font-medium text-gray-800">
                                      {comment.username}
                                    </span>
                                    <span className="text-xs text-gray-400">
                                      {comment.createdAt &&
                                        formatDistanceToNow(
                                          new Date(comment.createdAt),
                                          {
                                            addSuffix: true,
                                          }
                                        )}
                                    </span>
                                  </div>

                                  {/* Edit Mode */}
                                  {showEditForm === comment.id ? (
                                    <form
                                      onSubmit={(e) =>
                                        handleEditSubmit(e, post.id, comment.id)
                                      }
                                      className="mt-1"
                                    >
                                      <textarea
                                        value={editingComment.content}
                                        onChange={handleEditChange}
                                        className="w-full p-2 border rounded"
                                        rows={2}
                                      />
                                      <div className="flex gap-2 mt-2">
                                        <button
                                          type="submit"
                                          className="bg-orange-500 text-white px-3 py-1 rounded"
                                        >
                                          Update
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => setShowEditForm(null)}
                                          className="bg-gray-200 px-3 py-1 rounded"
                                        >
                                          Cancel
                                        </button>
                                      </div>
                                    </form>
                                  ) : (
                                    <>
                                      <p className="text-gray-600 mt-1">
                                        {comment.comment}
                                      </p>
                                      {/* Show Edit/Delete only for comment author */}
                                      {comment.username === username && (
                                        <div className="flex gap-2 mt-2">
                                          <button
                                            onClick={() =>
                                              handleEditClick(comment)
                                            }
                                            className="text-blue-600 text-xs hover:underline"
                                          >
                                            Edit
                                          </button>
                                          <button
                                            onClick={() =>
                                              handleDeleteComment(
                                                post.id,
                                                comment.id
                                              )
                                            }
                                            className="text-red-600 text-xs hover:underline"
                                          >
                                            Delete
                                          </button>
                                        </div>
                                      )}
                                    </>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-400 italic text-center py-4">
                            No comments yet. Be the first to comment!
                          </p>
                        )}

                        {/* Comment Form */}
                        {showCommentBox === post.id && (
                          <form
                            onSubmit={(e) => handleCommentSubmit(e, post.id)}
                            className="mt-4"
                          >
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-xs font-bold text-orange-600 mt-1">
                                {username.charAt(0).toUpperCase()}
                              </div>
                              <div className="flex-1">
                                <textarea
                                  value={commentContent}
                                  onChange={handleCommentChange}
                                  className="w-full p-3 rounded-lg border border-gray-200 focus:border-orange-300 focus:ring-2 focus:ring-orange-100 transition-all"
                                  placeholder="Write a comment..."
                                  rows="2"
                                />
                                <div className="flex justify-end mt-2">
                                  <button
                                    type="submit"
                                    className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                                  >
                                    Post
                                  </button>
                                </div>
                              </div>
                            </div>
                          </form>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - Communities */}
            <div className="lg:w-1/4 w-full">
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="bg-orange-100 text-orange-600 p-2 rounded-full">
                  </span>
                  Food Communities
                </h2>

                <button
                  onClick={() => setShowForm(!showForm)}
                  className="w-full mb-4 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-3 rounded-lg hover:from-green-600 hover:to-green-700 transition-all flex items-center justify-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Create Community
                </button>

                {showForm && (
                  <form
                    onSubmit={handleFormSubmit}
                    className="bg-orange-50 p-4 rounded-xl shadow space-y-3 mb-6 border border-orange-100"
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Community Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Vegan Recipes"
                        value={newCommunity.name}
                        onChange={(e) =>
                          setNewCommunity({
                            ...newCommunity,
                            name: e.target.value,
                          })
                        }
                        className="w-full border border-gray-300 p-2 rounded focus:border-orange-300 focus:ring-2 focus:ring-orange-100"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        placeholder="What's this community about?"
                        value={newCommunity.description}
                        onChange={(e) =>
                          setNewCommunity({
                            ...newCommunity,
                            description: e.target.value,
                          })
                        }
                        className="w-full border border-gray-300 p-2 rounded focus:border-orange-300 focus:ring-2 focus:ring-orange-100"
                        rows="3"
                        required
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="flex-1 bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition-colors"
                      >
                        Create
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowForm(false)}
                        className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                <div className="space-y-4">
                  {foodCommunities.length > 0 ? (
                    foodCommunities.map((community) => (
                      <div
                        key={community.id}
                        className="bg-white border border-orange-100 rounded-xl shadow-sm hover:shadow-md transition-shadow p-4"
                      >
                        <h3 className="text-lg font-bold text-orange-600 mb-1">
                          {community.name}
                        </h3>
                        <p className="text-gray-600 text-sm mb-3">
                          {community.description}
                        </p>
                        <button
                          className="w-full mt-2 bg-orange-100 text-orange-600 py-2 px-3 rounded-lg text-sm hover:bg-orange-200 transition-colors flex items-center justify-center gap-2"
                          onClick={() => navigate(`/community/${community.id}`)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                            />
                          </svg>
                          Join Community
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-gray-500">
                      <p>No communities yet. Create one!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;