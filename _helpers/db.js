const sql = require('mssql');
const config = require('../config.json');

class Database {
  constructor() {
    this.pool = null;
  }

  async connect() {
    try {
      if (!this.pool) {
        this.pool = await sql.connect(config);
      }
      return this.pool;
    } catch (error) {
      console.error('Database connection error:', error);
    }
  }

  async disconnect() {
    try {
      if (this.pool) {
        await this.pool.close();
        this.pool = null;
      }
    } catch (error) {
      console.error('Database disconnection error:', error);
    }
  }

  async bulkImport(data) {
    return new Promise((resolve, reject) => {
      const pool = new sql.ConnectionPool(config);
      pool.connect()
        .then(() => {
          const request = pool.request();
          request.bulk(data)
            .then(result => {
              resolve(result);
            })
            .catch(err => {
              console.error('Error during bulk insert:', err);
              reject(err);
            })
            .finally(() => {
              pool.close();
            });
        })
        .catch(err => {
          console.error('Error connecting to the database:', err);
          reject(err);
        });
    });
  }

  async performBulkInsert(data) {
    try {
      const request = this.pool.request();
      const result = await request.bulk(data);
      return result;
    } catch (error) {
      console.error('Error during bulk insert:', error);
      throw error; // Re-throw the error to be caught by the calling code
    } finally {
      pool.close(); // Make sure to close the connection pool
    }
  }
}

module.exports = new Database();