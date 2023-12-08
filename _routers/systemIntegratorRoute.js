const express = require('express');
const router = express.Router();
const database = require('../_helpers/db');
const constants = require("../_helpers/constants");
const sql = require('mssql');

router.post('/SystemIntegratorInsertUpdate', SystemIntegratorInsertUpdate);

router.get('/SystemIntegratorGetAll', SystemIntegratorGetAll);
router.get('/SystemIntegratorGetActive', SystemIntegratorGetActive);
router.get('/SystemIntegratorGetById', SystemIntegratorGetById);
module.exports = router;

async function SystemIntegratorInsertUpdate(req, res, next) {
    try {
        const pool = await database.connect();
        result = await pool.request().input('SystemIntegratorId', sql.Int, req.body.SystemIntegratorId)
            .input('SystemIntegratorName', sql.VarChar(100), req.body.SystemIntegratorName)
            .input('SystemIntegratorAddress', sql.VarChar(100), req.body.SystemIntegratorAddress)
            .input('SystemIntegratorEmailId', sql.VarChar(100), req.body.SystemIntegratorEmailId)
            .input('SystemIntegratorMobileNumber', sql.VarChar(15), req.body.SystemIntegratorMobileNumber)
            .input('SystemIntegratorLoginId', sql.VarChar(255), req.body.SystemIntegratorLoginId)
            .input('SystemIntegratorLoginPassword', sql.VarChar(255), req.body.SystemIntegratorMobileNumber)
            .input('DataStatus', sql.Int, req.body.DataStatus)
            .input('CreatedBy', sql.Int, req.body.CreatedBy)
            .input('ModifiedBy', sql.Int, req.body.CreatedBy)
            .input('CreatedDate', sql.DateTime, req.body.CreatedDate)
            .input('ModifiedDate', sql.DateTime, req.body.ModifiedDate)
            .execute('USP_SystemIntegratorInsertUpdate');
        await database.disconnect();
        let out = constants.ResponseMessageList(result.recordset, null);
        res.status(200).json(out)
    } catch (error) {
        let out = constants.ResponseMessage(error.message, null);
        res.status(400).json(out);
    }
}

async function SystemIntegratorGetAll(req, res, next) {
    try {
        const pool = await database.connect();
        result = await pool.request().execute('USP_SystemIntegratorGetAll');
        await database.disconnect();
        let out = constants.ResponseMessage("success", result.recordset);
        res.status(200).json(out)
    } catch (error) {
        let out = constants.ResponseMessage(error.message, null);
        res.status(400).json(out);
    }
}
async function SystemIntegratorGetActive(req, res, next) {
    try {
        const pool = await database.connect();
        result = await pool.request().execute('USP_SystemIntegratorGetActive');
        await database.disconnect();
        let out = constants.ResponseMessage("success", result.recordset);
        res.status(200).json(out)
    } catch (error) {
        let out = constants.ResponseMessage(error.message, null);
        res.status(400).json(out);
    }
}

async function SystemIntegratorGetById(req, res, next) {
    try {
        const SystemIntegratorId = req.query.SystemIntegratorId | 0;
        const pool = await database.connect();
        result = await pool.request().input('SystemIntegratorId', sql.Int, SystemIntegratorId)
            .execute('USP_SystemIntegratorGetbyId');
        await database.disconnect();
        if (result.recordset == []) {
            let out = constants.ResponseMessage("No data found", null);
            res.status(200).json(out);
        }
        else {
            let out = constants.ResponseMessage("success", result.recordset[0]);
            res.status(200).json(out);
        }
    } catch (error) {
        let out = constants.ResponseMessage(error.message, null);
        res.status(400).json(out);
    }
}