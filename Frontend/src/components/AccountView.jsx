import React, { useState } from "react";
import api from "../utils/api";
import TransactionList from "./TransactionList";

export default function AccountView({ accounts, onAccountsUpdated }) {
  const [selected, setSelected] = useState(accounts[0]?.account_id || "");
  const [amount, setAmount] = useState("");
  const [toAccount, setToAccount] = useState("");
  const [remarks, setRemarks] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [loadingTx, setLoadingTx] = useState(false);

  const fetchTransactions = async (id) => {
    if (!id) return;
    setLoadingTx(true);
    try {
      const { data } = await api.get(`/transactions/account/${id}`);
      setTransactions(data.transactions);
    } catch (err) {
      alert("Could not fetch transactions");
    } finally {
      setLoadingTx(false);
    }
  };

  React.useEffect(() => {
    if (accounts.length && !selected) setSelected(accounts[0].account_id);
    fetchTransactions(selected);
    // eslint-disable-next-line
  }, [accounts, selected]);

  const doAction = async (type) => {
    const amt = parseFloat(amount);
    if (!selected || !amt || amt <= 0) return alert("Enter valid amount and select account");

    try {
      if (type === "deposit") {
        await api.post("/transactions/deposit", { account_id: selected, amount: amt, remarks });
        alert("Deposit successful");
      } else if (type === "withdraw") {
        await api.post("/transactions/withdraw", { account_id: selected, amount: amt, remarks });
        alert("Withdraw successful");
      } else if (type === "transfer") {
        if (!toAccount) return alert("Enter destination account id");
        await api.post("/transactions/transfer", { from_account_id: selected, to_account_id: toAccount, amount: amt, remarks });
        alert("Transfer successful");
      }
      setAmount(""); setRemarks(""); setToAccount("");
      await fetchTransactions(selected);
      onAccountsUpdated();
    } catch (err) {
      alert(err.response?.data?.message || "Action failed");
    }
  };

  return (
    <div className="card mt">
      <h4>Account Details & Transactions</h4>

      <div className="stack">
        <label>Select account</label>
        <select value={selected} onChange={(e)=>{ setSelected(e.target.value); fetchTransactions(e.target.value); }}>
          {accounts.map(a=> <option key={a.account_id} value={a.account_id}>{a.account_type} - {a.account_id} - ₹{parseFloat(a.balance).toFixed(2)}</option>)}
        </select>
      </div>

      <div className="grid-2 mt">
        <div className="card small">
          <h5>Perform Transaction</h5>
          <input placeholder="Amount" value={amount} onChange={(e)=>setAmount(e.target.value)} />
          <input placeholder="Remarks (optional)" value={remarks} onChange={(e)=>setRemarks(e.target.value)} />
          <div className="stack">
            <button className="btn" onClick={()=>doAction("deposit")}>Deposit</button>
            <button className="btn" onClick={()=>doAction("withdraw")}>Withdraw</button>
          </div>
        </div>

        <div className="card small">
          <h5>Transfer Funds</h5>
          <input placeholder="To account id" value={toAccount} onChange={(e)=>setToAccount(e.target.value)} />
          <input placeholder="Amount" value={amount} onChange={(e)=>setAmount(e.target.value)} />
          <button className="btn" onClick={()=>doAction("transfer")}>Transfer</button>
        </div>
      </div>

      <div className="mt">
        <h5>Transactions</h5>
        <TransactionList transactions={transactions} loading={loadingTx} />
      </div>
    </div>
  );
}
