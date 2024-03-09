import mysql from "mysql";

export const conn = mysql.createPool({
    
  connectionLimit: 10,
  host: "sql6.freemysqlhosting.net",
  user: "sql6689845",
  password: "2Lrxrl432I",
  database: "sql6689845",
});