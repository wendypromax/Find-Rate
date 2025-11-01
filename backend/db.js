import mysql from "mysql2/promise";

export const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "find&rate", // permitido si tu servidor MySQL lo acepta
});
