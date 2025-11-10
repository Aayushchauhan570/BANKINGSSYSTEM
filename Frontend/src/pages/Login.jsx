import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", form, {withCredentials: true});
      localStorage.setItem("token", data.token);
      localStorage.setItem("name", data.user.name);
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Login error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-center">
      <div className="card auth-card">
        <h2>Banking System — Login</h2>
        <form onSubmit={submit} className="stack">
          <input placeholder="Email" value={form.email} onChange={(e)=>setForm({...form,email:e.target.value})} required/>
          <input placeholder="Password" type="password" value={form.password} onChange={(e)=>setForm({...form,password:e.target.value})} required/>
          <button className="btn" disabled={loading}>{loading ? "Logging..." : "Login"}</button>
        </form>
        <div className="muted">Don't have an account? <Link to="/register">Register</Link></div>
      </div>
    </div>
  );
}
