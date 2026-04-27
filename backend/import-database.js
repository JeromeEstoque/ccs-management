const mysql = require("mysql2/promise");
const fs = require("fs");
const path = require("path");

// Database connection details from environment variables
const connectionConfig = {
  host: process.env.DB_HOST || "monorail.proxy.rlwy.net",
  port: process.env.DB_PORT || 23050,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "lHKmUyBOpIWRPrIpJbFJGhgaREJvlHyP",
  database: process.env.DB_NAME || "railway",
  multipleStatements: true,
};

async function importDatabase() {
  let connection;
  try {
    console.log("Connecting to Railway MySQL database...");
    connection = await mysql.createConnection(connectionConfig);
    console.log("✅ Connected to database successfully");

    // Read the SQL file
    const sqlFilePath = path.join(__dirname, "..", "ccs_management.sql");
    console.log("Reading SQL file...");
    const sql = fs.readFileSync(sqlFilePath, "utf8");
    console.log("✅ SQL file read successfully");

    // Execute the SQL
    console.log("Importing database schema...");
    await connection.query(sql);
    console.log("✅ Database schema imported successfully");

    // Verify tables were created
    const [tables] = await connection.query("SHOW TABLES");
    console.log(`\n📊 Tables created: ${tables.length}`);
    tables.forEach((table) => {
      console.log(`   - ${Object.values(table)[0]}`);
    });
  } catch (error) {
    console.error("❌ Error importing database:", error.message);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
      console.log("\n🔌 Database connection closed");
    }
  }
}

importDatabase()
  .then(() => {
    console.log("\n🎉 Database import completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n💥 Database import failed:", error.message);
    process.exit(1);
  });
