import React from "react";

export default function AccountCard({ acc }) {
  return (
    <div className="account-card">
      <div>
        <div className="muted">Account ID</div>
        <div className="mono">{acc.account_id}</div>
      </div>
      <div>
        <div className="muted">Type</div>
        <div>{acc.account_type}</div>
      </div>
      <div>
        <div className="muted">Balance</div>
        <div className="balance">₹ {parseFloat(acc.balance).toFixed(2)}</div>
      </div>
    </div>
  );
}
