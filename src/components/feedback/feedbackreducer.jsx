import { useEffect, useState } from "react";
export default function Feedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [name, setName] = useState("");
  const [newFeedback, setNewFeedback] = useState("");
  const [newComment, setNewComment] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [newReply, setNewReply] = useState("");
  const [replyId, setReplyId] = useState(null);
  const fetchFeedbacks = async () => {
    try {
      const res = await fetch("http://localhost:4500/api/data");
      const data = await res.json();
      setFeedbacks(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !newFeedback || !newComment) return;

    try {
      if (editingId) {
        const res = await fetch(`http://localhost:4500/api/data/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, feedback: newFeedback, comment: newComment }),
        });
        const data = await res.json();
        alert(data.message);
        setEditingId(null);
      } else {
        const res = await fetch("http://localhost:4500/api/data", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, feedback: newFeedback, comment: newComment }),
        });
        const data = await res.json();
        alert(data.message);
      }
      setName("");
      setNewFeedback("");
      setNewComment("");
      fetchFeedbacks();
    } catch (err) {
      console.error(err);
    }
  };
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this feedback?")) return;
    try {
      const res = await fetch(`http://localhost:4500/api/data/${id}`, { method: "DELETE" });
      const data = await res.json();
      alert(data.message);
      fetchFeedbacks();
    } catch (err) {
      console.error(err);
    }
  };
  const handleEdit = (fb) => {
    setEditingId(fb._id);
    setName(fb.name);
    setNewFeedback(fb.feedback);
    setNewComment(fb.comment);
  };
  const handleReply = (fb) => {
    setReplyId(fb._id);
    setNewReply(fb.reply || "");
  };
  const saveReply = async () => {
    try {
      const res = await fetch(`http://localhost:4500/api/data/${replyId}/reply`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reply: newReply }),
      });
      const data = await res.json();
      alert(data.message);
      setReplyId(null);
      setNewReply("");
      fetchFeedbacks();
    } catch (err) {
      console.error(err);
    }
  };
  const getFeedbackColor = (feedback) => {
    switch (feedback.toLowerCase()) {
      case "excellent": return { bg: "#d9fdd3", color: "green" };
      case "very good": return { bg: "#d0ebff", color: "#0066cc" };
      case "good": return { bg: "#fff9c4", color: "#b58900" };
      case "average": return { bg: "#ffe5b4", color: "orange" };
      case "poor":
      case "bad": return { bg: "#ffd6d6", color: "red" };
      default: return { bg: "#f2f2f2", color: "gray" };
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>User Feedback</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px", display: "flex", flexWrap: "wrap", gap: "10px" }}>
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{ padding: "8px", flex: "1 1 200px" }}
        />
        <select
          value={newFeedback}
          onChange={(e) => setNewFeedback(e.target.value)}
          required
          style={{ padding: "8px", flex: "1 1 200px" }}
        >
          <option value="">Select feedback</option>
          <option value="Excellent">Excellent</option>
          <option value="Very Good">Very Good</option>
          <option value="Good">Good</option>
          <option value="Average">Average</option>
          <option value="Poor">Poor</option>
          <option value="Bad">Bad</option>
        </select>
        <input
          type="text"
          placeholder="Enter your comment"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          required
          style={{ padding: "8px", flex: "2 1 300px" }}
        />

        <button
          type="submit"
          style={{
            background: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "8px",
            padding: "8px 16px",
            cursor: "pointer",
          }}
        >
          {editingId ? "Update" : "Submit"}
        </button>

        {editingId && (
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setName("");
              setNewFeedback("");
              setNewComment("");
            }}
            style={{
              background: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: "8px",
              padding: "8px 16px",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
        )}
      </form>
      {feedbacks.length === 0 ? (
        <p>No feedback submitted yet.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#007bff", color: "white" }}>
              <th style={{ padding: "8px" }}>Name</th>
              <th style={{ padding: "8px" }}>Feedback</th>
              <th style={{ padding: "8px" }}>Comment</th>
              <th style={{ padding: "8px" }}>Reply</th>
              <th style={{ padding: "8px" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {feedbacks.map((fb) => {
              const { bg, color } = getFeedbackColor(fb.feedback);
              return (
                <tr key={fb._id} style={{ backgroundColor: bg }}>
                  <td style={{ padding: "8px" }}>{fb.name}</td>
                  <td style={{ padding: "8px", color, fontWeight: "bold" }}>{fb.feedback}</td>
                  <td style={{ padding: "8px" }}>{fb.comment}</td>
                  <td style={{ padding: "8px" }}>
                    {replyId === fb._id ? (
                      <>
                        <input
                          value={newReply}
                          onChange={(e) => setNewReply(e.target.value)}
                          style={{ padding: "4px", marginRight: "4px" }}
                        />
                        <button
                          onClick={saveReply}
                          style={{
                            background: "#17a2b8",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            padding: "4px 8px",
                            cursor: "pointer",
                          }}
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setReplyId(null)}
                          style={{
                            background: "#6c757d",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            padding: "4px 8px",
                            marginLeft: "4px",
                            cursor: "pointer",
                          }}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <span>{fb.reply || "-"}</span>
                    )}
                  </td>
                  <td style={{ padding: "8px" }}>
                    <button
                      onClick={() => handleEdit(fb)}
                      style={{
                        background: "#007bff",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        padding: "4px 8px",
                        marginRight: "4px",
                        cursor: "pointer",
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(fb._id)}
                      style={{
                        background: "#f48766ff",
                        color: "black",
                        border: "none",
                        borderRadius: "4px",
                        padding: "4px 8px",
                        marginRight: "4px",
                        cursor: "pointer",
                      }}
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => handleReply(fb)}
                      style={{
                        background: "#6c9bafff",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        padding: "4px 8px",
                        cursor: "pointer",
                      }}
                    >
                      Reply
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
