const express = require('express');
const router = express.Router();
const database = require('../_helpers/db');
const constants = require("../_helpers/constants");
const sql = require('mssql');
const moment = require('moment');

router.get('/DashboardGetData', DashboardGetData);

module.exports = router;

async function DashboardGetData(req, res, next) {
    try {
        const pool = await database.connect();
        const result = await pool.request().execute('USP_DashboardGetData');
        await database.disconnect();
        let out = constants.ResponseMessage("success", result.recordsets);
        res.status(200).json(out);
    } catch (error) {
        let out = constants.ResponseMessage(error.message, null);
        res.status(400).json(out);
    }
}