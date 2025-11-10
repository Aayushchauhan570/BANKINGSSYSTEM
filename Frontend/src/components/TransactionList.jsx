import React from "react";

export default function TransactionList({ transactions, loading }) {
  if (loading) return <p>Loading transactions...</p>;
  if (!transactions || transactions.length === 0) return <p>No transactions yet.</p>;

  return (
    <div className="tx-list">
      {transactions.map(tx => (
        <div className="tx" key={tx.transaction_id}>
          <div className="tx-left">
            <div className="mono">#{tx.transaction_id}</div>
            <div className="muted small">{new Date(tx.transaction_date).toLocaleString()}</div>
          </div>
          <div className="tx-mid">
            <div className="muted">{tx.type}</div>
            <div>{tx.remarks || ""}</div>
          </div>
          <div className="tx-right">
            <div className={tx.type.toLowerCase()==="deposit" || tx.type.toLowerCase()==="transfer" ? "amount plus" : "amount minus"}>
              {tx.type.toLowerCase()==="withdraw" ? "- " : "+ "}₹{parseFloat(tx.amount).toFixed(2)}
            </div>
            <div className="muted small">to {tx.receiver_account || "-"}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
