export const createAccountTable = async (db) => {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS Account (
      account_id INT PRIMARY KEY AUTO_INCREMENT,
      customer_id INT NOT NULL,
      account_type VARCHAR(50),
      balance DECIMAL(15, 2) DEFAULT 0.00,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (customer_id) REFERENCES Customer(customer_id) ON DELETE CASCADE
    );
  `);
};

export const createTransactionLogTable = async (db) => {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS TransactionLog (
      transaction_id INT PRIMARY KEY AUTO_INCREMENT,
      account_id INT NOT NULL,
      type VARCHAR(50),
      amount DECIMAL(15, 2),
      receiver_account INT,
      remarks VARCHAR(255),
      transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (account_id) REFERENCES Account(account_id) ON DELETE CASCADE,
      FOREIGN KEY (receiver_account) REFERENCES Account(account_id) ON DELETE SET NULL
    );
  `);
};
