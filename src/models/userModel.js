const db = require("../config/db");

class Users {
  static async create(name, email, password) {
    const sql = "insert into users (email,name,password) values (?,?,?);";
    return await db.execute(sql, [name, email, password]);
  }
  static async findByEmail(email) {
    const sql = "select * from users where email=?;";
    const [rows] = await db.execute(sql, email);
    return rows[0];
  }
  static async findById(id) {
    const sql = "select id, name, email, created_at from users where id=?;";
    const [rows] = await db.execute(sql, id);
    return rows[0];
  }
}
module.exports = Users;
