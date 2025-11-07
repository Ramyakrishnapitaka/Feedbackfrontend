import { useEffect, useState } from "react";

export default function Feedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [name, setName] = useState("");
  const [feedback, setFeedback] = useState("");
  const [comment, setComment] = useState("");
  const [editingId, setEditingId] = useState(null);

  const user = JSON.parse(localStorage.getItem("loggedInUser"));

  const fetchFeedbacks = async () => {
    const res = await fetch("https://feedbackbackend-pfzn.onrender.com/api/data");
    const data = await res.json();
    setFeedbacks(data.filter(f => f.userId === user._id));
  };

  useEffect(() => { fetchFeedbacks(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingId ? `https://feedbackbackend-pfzn.onrender.com/api/data/${editingId}` : "http://localhost:4500/api/data";
    const method = editingId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, feedback, comment, userId: user._id }),
      });
      const data = await res.json();
      if (!res.ok) return alert(data.message);
      alert(data.message);
      setEditingId(null); setName(""); setFeedback(""); setComment("");
      fetchFeedbacks();
    } catch (err) {
      console.error(err);
      alert("Error saving feedback");
    }
  };

  const handleEdit = f => { setEditingId(f._id); setName(f.name); setFeedback(f.feedback); setComment(f.comment); };
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

  return (
    <div style={{ maxWidth: "600px", margin: "50px auto", padding: "20px", borderRadius: "12px", background: "#f8f9fa" }}>
      <h2 style={{ textAlign: "center", color: "#007bff", marginBottom: "20px" }}>User Feedback</h2>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "30px" }}>
        <input
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
          style={{ padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }}
        />

        <select
          value={feedback}
          onChange={e => setFeedback(e.target.value)}
          style={{ padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }}
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
          placeholder="Comment"
          value={comment}
          onChange={e => setComment(e.target.value)}
          style={{ padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }}
        />

        <button
          type="submit"
          style={{
            padding: "10px",
            borderRadius: "8px",
            border: "none",
            backgroundColor: "#007bff",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          {editingId ? "Update" : "Submit"}
        </button>
      </form>

      <h3 style={{ marginBottom: "15px", color: "#007bff" }}>Your Feedbacks</h3>

      {feedbacks.map(f => (
        <div key={f._id} style={{
          border: "1px solid #ccc",
          borderRadius: "10px",
          padding: "15px",
          marginBottom: "15px",
          backgroundColor: "#fff",
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
        }}>
          <p style={{ fontWeight: "bold", marginBottom: "5px" }}>{f.name} - <span style={{ color: "#555" }}>{f.feedback}</span></p>
          <p style={{ marginBottom: "10px" }}>{f.comment}</p>
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={() => handleEdit(f)}
              style={{
                padding: "6px 12px",
                backgroundColor: "#28a745",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer"
              }}
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(f._id)}
              style={{
                padding: "6px 12px",
                backgroundColor: "#dc3545",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer"
              }}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

