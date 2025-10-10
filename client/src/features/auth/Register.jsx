// client/src/features/auth/Register.jsx
import React, { useState } from "react";
import api from "../../api/axios";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
  });
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let avatarUrl = "";
    if (file) {
      const fd = new FormData();
      fd.append("file", file);
      const up = await api.post("/upload", fd);
      avatarUrl = up.data.url;
    }
    await api.post("/auth/register", { ...form, avatar: avatarUrl });
    alert("Registered — check your email for verification");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        required
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        placeholder="Name"
      />
      <input
        required
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        placeholder="Email"
      />
      <input
        required
        type="password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        placeholder="Password"
      />
      <input
        value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
        placeholder="Phone (optional)"
      />
      <input
        value={form.address}
        onChange={(e) => setForm({ ...form, address: e.target.value })}
        placeholder="Address"
      />
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button type="submit">Register</button>
    </form>
  );
}
