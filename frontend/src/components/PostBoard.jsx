import React, { useState, useEffect } from "react";
import PostReply from "./PostReply";

// Simple in-memory store for demo; replace with API in production
const LOCAL_STORAGE_KEY = "emp_posts";

function getPosts() {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}
function savePosts(posts) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(posts));
}

export default function PostBoard() {
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState({ title: "", content: "" });
  const [msg, setMsg] = useState("");
  const role = localStorage.getItem("role");
  const username = localStorage.getItem("username");

  useEffect(() => {
    setPosts(getPosts());
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.content) return;
    const newPost = {
      ...form,
      author: username || role,
      date: new Date().toLocaleString(),
      id: Date.now(),
      replies: [],
    };
    const updated = [newPost, ...posts];
    setPosts(updated);
    savePosts(updated);
    setForm({ title: "", content: "" });
    setMsg("Post published!");
    setTimeout(() => setMsg(""), 2000);
  };

  // Add reply to a post
  const handleReply = (postId, text, replyTo) => {
    setPosts(prev => {
      const updated = prev.map(post => {
        if (post.id === postId) {
          let from = role === "employee" ? username : (role === "hr" ? username || "HR" : username || "Admin");
          return {
            ...post,
            replies: [...(post.replies || []), { from, text, date: new Date().toLocaleString(), replyTo }],
          };
        }
        return post;
      });
      savePosts(updated);
      return updated;
    });
  };

  // Delete post if creator
  const handleDeletePost = (postId) => {
    setPosts(prev => {
      const updated = prev.filter(post => post.id !== postId);
      savePosts(updated);
      return updated;
    });
  };

  return (
    <div className="post-board-bg">
      {(role === "admin" || role === "hr") && (
        <form className="post-form" onSubmit={handleSubmit}>
          <h3>Post News / Opening</h3>
          <input
            type="text"
            placeholder="Title"
            value={form.title}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            required
          />
          <textarea
            placeholder="Content"
            value={form.content}
            onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
            required
          />
          <button type="submit">Publish</button>
          {msg && <span style={{ color: 'green', marginLeft: 10 }}>{msg}</span>}
        </form>
      )}
      <div className="post-list">
        {posts.length === 0 && <div className="post-empty">No posts yet.</div>}
        {posts.map(post => (
          <div className="post-card" key={post.id}>
            <div className="post-title">{post.title}</div>
            <div className="post-meta">By {post.author} on {post.date}</div>
            <div className="post-content">{post.content}</div>
            {((post.author === username) || (role === "admin")) && (
              <button className="post-reply-btn post-delete-btn" style={{background:'#ef4444',marginBottom:'0.7rem'}} onClick={() => handleDeletePost(post.id)}>Delete Post</button>
            )}
            <PostReply
              postId={post.id}
              replies={post.replies || []}
              onReply={handleReply}
              userRole={role}
              username={username}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
