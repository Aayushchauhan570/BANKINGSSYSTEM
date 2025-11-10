import React, { useEffect, useState } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import api from "../utils/api";
import AccountCard from "../components/AccountCard";
import AccountView from "../components/AccountView";

function Navbar({ name, onLogout }) {
  return (
    <header className="nav">
      <div className="nav-left">
        <h3>MyBank</h3>
      </div>
      <div className="nav-right">
        <span className="muted">Hi, {name}</span>
        <button className="btn small" onClick={onLogout}>Logout</button>
      </div>
    </header>
  );
}

export default function Dashboard() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const name = localStorage.getItem("name") || "User";

  useEffect(() => {
    fetchAccounts();
    // eslint-disable-next-line
  }, []);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/accounts");
      setAccounts(data.accounts);
    } catch (err) {
      alert("Error fetching accounts");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div>
      <Navbar name={name} onLogout={logout} />
      <main className="container">
        <div className="grid">
          <section className="card">
            <h4>Your Accounts</h4>
            {loading ? <p>Loading...</p> : (
              <div className="accounts-list">
                {accounts.length === 0 && <p>No accounts found.</p>}
                {accounts.map(acc => (
                  <AccountCard key={acc.account_id} acc={acc} />
                ))}
              </div>
            )}
          </section>

          <section className="card">
            <h4>Quick Actions</h4>
            <div className="stack">
              <Link to="account" className="btn">View account & transactions</Link>
            </div>
          </section>
        </div>

        <Routes>
          <Route path="account" element={<AccountView accounts={accounts} onAccountsUpdated={fetchAccounts} />} />
        </Routes>
      </main>
    </div>
  );
}
