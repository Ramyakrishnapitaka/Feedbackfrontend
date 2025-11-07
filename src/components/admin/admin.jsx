import { useEffect, useState } from "react";

export default function Admin() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [replyId, setReplyId] = useState(null);
  const [replyText, setReplyText] = useState("");

  const user = JSON.parse(localStorage.getItem("loggedInUser"));

  const fetchFeedbacks = async () => {
    const res = await fetch("https://feedbackbackend-pfzn.onrender.com/api/data");
    const data = await res.json();
    setFeedbacks(data);
  };

  useEffect(() => { fetchFeedbacks(); }, []);

  const handleReply = f => { setReplyId(f._id); setReplyText(f.reply || ""); };
  const saveReply = async () => {
    const res = await fetch(`https://feedbackbackend-pfzn.onrender.com/api/data/${replyId}/reply`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reply: replyText, userId: user._id }),
    });
    const data = await res.json();
    alert(data.message);
    setReplyId(null); setReplyText("");
    fetchFeedbacks();
  };

  const handleDelete = async fId => {
    const res = await fetch(`https://feedbackbackend-pfzn.onrender.com/api/data/${fId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user._id }),
    });
    const data = await res.json();
    alert(data.message);
    fetchFeedbacks();
  };
  const feedbackColor = (text) => {
    switch (text) {
      case "Excellent": return "#28a745"; 
      case "Very Good": return "#20c997"; 
      case "Good": return "#ffc107"; 
      case "Average": return "#fd7e14"; 
      case "Poor": return "#dc3545"; 
      case "Bad": return "#6c757d"; 
      default: return "#007bff"; 
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "50px auto", padding: "20px" }}>
      <h2 style={{ textAlign: "center", color: "#007bff", marginBottom: "30px" }}>Admin Dashboard</h2>

      {feedbacks.map(f => (
        <div key={f._id} style={{
          border: `2px solid ${feedbackColor(f.feedback)}`,
          borderRadius: "10px",
          padding: "15px",
          marginBottom: "15px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          backgroundColor: "#fff",
        }}>
          <p style={{ fontWeight: "bold", marginBottom: "5px" }}>
            {f.name} - <span style={{ color: feedbackColor(f.feedback) }}>{f.feedback}</span>
          </p>
          <p style={{ marginBottom: "5px" }}>{f.comment}</p>
          <p style={{ marginBottom: "10px" }}>
            Reply: {replyId === f._id 
              ? <input 
                  value={replyText} 
                  onChange={e => setReplyText(e.target.value)} 
                  style={{ padding: "5px", width: "60%", borderRadius: "5px", border: "1px solid #ccc" }} 
                /> 
              : f.reply || "-"
            }
          </p>

          <div style={{ display: "flex", gap: "10px" }}>
            {replyId === f._id ? (
              <button 
                onClick={saveReply} 
                style={{ padding: "6px 12px", backgroundColor: "#28a745", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}
              >
                Save Reply
              </button>
            ) : (
              <button 
                onClick={() => handleReply(f)} 
                style={{ padding: "6px 12px", backgroundColor: "#007bff", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}
              >
                Reply
              </button>
            )}

            <button 
              onClick={() => handleDelete(f._id)} 
              style={{ padding: "6px 12px", backgroundColor: "#dc3545", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
