// CREATE TABLE users (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     registration_date DATETIME  DEFAULT CURRENT_TIMESTAMP,
//     telegram_id BIGINT,
//     name VARCHAR(255),
//     surname VARCHAR(255),
//     selfie_size FLOAT
// );

import mysql, { RowDataPacket } from "mysql2";

let pool: mysql.Pool | null = null;

interface IUser {
  id: number;
  registration_date: Date;
  telegram_id: number;
  name: string;
  surname: string;
  selfie_size: number;
}

interface IUserRow extends RowDataPacket, IUser {}

async function initDataBase() {
  pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "admin",
    database: "party-registration",
  });
}

export async function getPool() {
  if (pool === null) {
    await initDataBase();
  }
  return pool;
}

export async function closePool() {
  if (pool !== null) {
    pool.end();
  }
}

export async function addUser(
  telegram_id: number,
  name: string,
  surname: string,
  selfie_size: number
) {
  const conn = await getPool();
  if (conn === null) {
    return;
  }
  conn.query(
    "INSERT INTO users (telegram_id, name, surname, selfie_size) VALUES (?, ?, ?, ?)",
    [telegram_id, name, surname, selfie_size],
    (err, results) => {
      if (err) {
        console.error("Error adding user:", err);
        return;
      }
      console.log("User added:", results);
    }
  );
}

export async function getUsers() {
  const conn = await getPool();
  if (conn === null) {
    return [];
  }
  return new Promise<IUserRow[]>((resolve, reject) => {
    conn.query<IUserRow[]>("SELECT * FROM users", (err, results) => {
      if (err) {
        console.error("Error getting users:", err);
        reject(err);
        return;
      }
      resolve(results);
    });
  });
}

export async function getUser(telegram_id: number) {
  const conn = await getPool();
  if (conn === null) {
    return null;
  }
  return new Promise<IUserRow>((resolve, reject) => {
    conn.query<IUserRow[]>(
      "SELECT * FROM users WHERE telegram_id = ?",
      [telegram_id],
      (err, results) => {
        if (err) {
          console.error("Error getting user:", err);
          reject(err);
          return;
        }
        resolve(results[0] as IUserRow);
      }
    );
  });
}
