export const createCustomerTable = async (db) => {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS Customer (
      customer_id INT PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(50),
      email VARCHAR(50) UNIQUE,
      password VARCHAR(100),
      address VARCHAR(100),
      phone VARCHAR(15),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
};
