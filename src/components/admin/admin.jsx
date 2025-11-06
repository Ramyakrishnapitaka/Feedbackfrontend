import { useEffect, useState } from "react";

export default function Admin() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [replyId, setReplyId] = useState(null);
  const [newReply, setNewReply] = useState("");
  const fetchFeedbacks = async () => {
    try {
      const res = await fetch("http://localhost:4500/api/data");
      const data = await res.json();
      setFeedbacks(data);
    } catch (err) {
      console.error("Error fetching feedbacks:", err);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);
  const handleReply = (id, currentReply) => {
    setReplyId(id);
    setNewReply(currentReply || "");
  };
  const saveReply = async (id) => {
    try {
      const res = await fetch(`http://localhost:4500/api/data/${id}/reply`, {
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
      console.error("Error saving reply:", err);
    }
  };
  const deleteFeedback = async (id) => {
    if (!window.confirm("Are you sure you want to delete this feedback?")) return;
    try {
      const res = await fetch(`http://localhost:4500/api/data/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      alert(data.message);
      fetchFeedbacks();
    } catch (err) {
      console.error("Error deleting feedback:", err);
    }
  };
  const getRowColor = (feedback) => {
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
  const buttonStyle = (bgColor, hoverColor) => ({
    background: bgColor,
    border: "none",
    borderRadius: "12px",
    padding: "6px 12px",
    cursor: "pointer",
    marginRight: "5px",
    color: "#fff",
    fontWeight: "bold",
  });

  return (
    <div style={{ padding: "20px" }}>
      <h2>Admin Dashboard</h2>

      {feedbacks.length === 0 ? (
        <p>No feedback available</p>
      ) : (
        <table
          border="1"
          cellPadding="10"
          style={{ width: "100%", borderCollapse: "collapse" }}
        >
          <thead style={{ background: "#007bff", color: "white" }}>
            <tr>
              <th>Name</th>
              <th>Feedback</th>
              <th>Comment</th>
              <th>Reply</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {feedbacks.map((fb) => {
              const { bg, color } = getRowColor(fb.feedback);
              return (
                <tr key={fb._id} style={{ backgroundColor: bg }}>
                  <td>{fb.name}</td>
                  <td style={{ color, fontWeight: "bold" }}>{fb.feedback}</td>
                  <td>{fb.comment}</td>
                  <td>
                    {replyId === fb._id ? (
                      <input
                        type="text"
                        value={newReply}
                        onChange={(e) => setNewReply(e.target.value)}
                        style={{ width: "100%", padding: "5px", borderRadius: "6px", border: "1px solid #ccc" }}
                      />
                    ) : (
                      fb.reply
                    )}
                  </td>
                  <td>
                    {replyId === fb._id ? (
                      <>
                        <button
                          style={buttonStyle("#28a745", "#218838")}
                          onMouseEnter={(e) => (e.target.style.background = "#218838")}
                          onMouseLeave={(e) => (e.target.style.background = "#28a745")}
                          onClick={() => saveReply(fb._id)}
                        >
                          Save
                        </button>
                        <button
                          style={buttonStyle("#6c757d", "#5a6268")}
                          onMouseEnter={(e) => (e.target.style.background = "#5a6268")}
                          onMouseLeave={(e) => (e.target.style.background = "#6c757d")}
                          onClick={() => setReplyId(null)}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          style={buttonStyle("#007bff", "#0069d9")}
                          onMouseEnter={(e) => (e.target.style.background = "#90b2d6ff")}
                          onMouseLeave={(e) => (e.target.style.background = "#90b2b6ff")}
                          onClick={() => handleReply(fb._id, fb.reply)}
                        >
                          Reply
                        </button>
                        <button
                          style={buttonStyle("#ec9ca4ff", "#ec9ca4ff")}
                          onMouseEnter={(e) => (e.target.style.background = "#ebaeb4ff")}
                          onMouseLeave={(e) => (e.target.style.background = "#ebaeb4ff")}
                          onClick={() => deleteFeedback(fb._id)}
                        >
                          Delete
                        </button>
                      </>
                    )}
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
