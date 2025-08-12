import React, { useState } from "react";

export default function PostReply({ postId, replies, onReply, userRole, username }) {
  const [reply, setReply] = useState("");
  const [show, setShow] = useState(false);
  const [replyTo, setReplyTo] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reply.trim()) return;
    onReply(postId, reply.trim(), replyTo);
    setReply("");
    setShow(false);
    setReplyTo(null);
  };

  const openReply = (to) => {
    setShow(true);
    setReplyTo(to);
    setReply(to ? `@${to} ` : "");
  };

  return (
    <div className="post-reply-section">
      {(userRole === "employee" || userRole === "hr" || userRole === "admin") && (
        <>
          <button className="post-reply-btn" onClick={() => openReply(null)}>
            {show ? "Cancel" : "Reply"}
          </button>
          {show && (
            <form className="post-reply-form" onSubmit={handleSubmit}>
              <textarea
                value={reply}
                onChange={e => setReply(e.target.value)}
                placeholder="Type your reply..."
                required
              />
              <button type="submit">Send</button>
            </form>
          )}
        </>
      )}
      {replies && replies.length > 0 && (
        <div className="post-reply-list">
          <div className="post-reply-title">Replies:</div>
          {replies.map((r, i) => (
            <div className={`post-reply-item${r.from === userRole || r.from === username ? " post-reply-own" : ""}`} key={i}>
              <span className="post-reply-author">{r.from}:</span> {r.text}
              {(userRole === "hr" || userRole === "admin") && (
                <button className="post-reply-btn post-reply-hr" onClick={() => openReply(r.from)}>
                  Reply
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
