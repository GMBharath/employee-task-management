
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const db = mysql.createPool({
    host: process.env.TIDB_HOST,
    port: Number(process.env.TIDB_PORT),
    user: process.env.TIDB_USER,
    password: process.env.TIDB_PASSWORD,
    database: process.env.TIDB_DATABASE,

    ssl: {
        minVersion: "TLSv1.2"
    }
});

export default db;
