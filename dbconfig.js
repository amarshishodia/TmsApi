module.exports = {
    HOST: "Softomation-Pundir",
    PORT: "1433",
    USER: "sa",
    PASSWORD: "Etoll@123",
    DB: "TMSv1",
    dialect: "mssql",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };