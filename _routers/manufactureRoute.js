const express = require('express');
const router = express.Router();
const database = require('../_helpers/db');
const constants = require("../_helpers/constants");
const sql = require('mssql');

router.post('/ManufactureInsertUpdate', ManufactureInsertUpdate);

router.get('/ManufactureGetAll', ManufactureGetAll);
router.get('/ManufactureGetActive', ManufactureGetActive);
router.get('/ManufactureGetById', ManufactureGetById);
module.exports = router;

async function ManufactureInsertUpdate(req, res, next) {
    try {
        const pool = await database.connect();
        result = await pool.request().input('ManufactureId', sql.Int, req.body.ManufactureId)
            .input('ManufactureName', sql.VarChar(100), req.body.ManufactureName)
            .input('ManufactureAddress', sql.VarChar(255), req.body.ManufactureAddress)
            .input('ManufactureEmailId', sql.VarChar(100), req.body.ManufactureEmailId)
            .input('ManufactureMobileNumber', sql.VarChar(20), req.body.ManufactureMobileNumber)
            .input('DataStatus', sql.Int, req.body.DataStatus)
            .input('CreatedBy', sql.Int, req.body.CreatedBy)
            .input('ModifiedBy', sql.Int, req.body.CreatedBy)
            .input('CreatedDate', sql.DateTime, req.body.CreatedDate)
            .input('ModifiedDate', sql.DateTime, req.body.ModifiedDate)
            .execute('USP_ManufactureInsertUpdate');
        await database.disconnect();
        let out = constants.ResponseMessageList(result.recordset, null);
        res.status(200).json(out)
    } catch (error) {
        let out = constants.ResponseMessage(error.message, null);
        res.status(400).json(out);
    }
}

async function ManufactureGetAll(req, res, next) {
    try {
        const pool = await database.connect();
        result = await pool.request().execute('USP_ManufactureGetAll');
        await database.disconnect();
        let out = constants.ResponseMessage("success", result.recordset);
        res.status(200).json(out)
    } catch (error) {
        let out = constants.ResponseMessage(error.message, null);
        res.status(400).json(out);
    }
}
async function ManufactureGetActive(req, res, next) {
    try {
        const pool = await database.connect();
        result = await pool.request().execute('USP_ManufactureGetActive');
        await database.disconnect();
        let out = constants.ResponseMessage("success", result.recordset);
        res.status(200).json(out)
    } catch (error) {
        let out = constants.ResponseMessage(error.message, null);
        res.status(400).json(out);
    }
}

async function ManufactureGetById(req, res, next) {
    try {
        const ManufactureId = req.query.ManufactureId | 0;
        const pool = await database.connect();
        result = await pool.request().input('ManufactureId', sql.Int, ManufactureId)
            .execute('USP_ManufactureGetbyId');
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