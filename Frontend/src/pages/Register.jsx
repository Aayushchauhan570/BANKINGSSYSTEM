import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", address: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/auth/register", form, {withCredentials: true});
      localStorage.setItem("token", data.token);
      localStorage.setItem("name", data.user.name);
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Registration error");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-center">
      <div className="card auth-card">
        <h2>Create account</h2>
        <form onSubmit={submit} className="stack">
          <input placeholder="Full name" value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} required/>
          <input placeholder="Email" value={form.email} onChange={(e)=>setForm({...form,email:e.target.value})} required/>
          <input placeholder="Password" type="password" value={form.password} onChange={(e)=>setForm({...form,password:e.target.value})} required/>
          <input placeholder="Address" value={form.address} onChange={(e)=>setForm({...form,address:e.target.value})}/>
          <input placeholder="Phone" value={form.phone} onChange={(e)=>setForm({...form,phone:e.target.value})}/>
          <button className="btn" disabled={loading}>{loading ? "Creating..." : "Register"}</button>
        </form>
        <div className="muted">Already have an account? <Link to="/">Login</Link></div>
      </div>
    </div>
  );
}
