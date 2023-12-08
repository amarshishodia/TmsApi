const express = require('express');
const router = express.Router();
const database = require('../_helpers/db');
const constants = require("../_helpers/constants");
const sql = require('mssql');

router.post('/PlazaInsertUpdate', PlazaInsertUpdate);

router.get('/PlazaGetAll', PlazaGetAll);
router.get('/PlazaGetActive', PlazaGetActive);
router.get('/PlazaGetById', PlazaGetById);
module.exports = router;

async function PlazaInsertUpdate(req, res, next) {
    try {
        const pool = await database.connect();
        result = await pool.request().input('PlazaId', sql.Int, req.body.PlazaId)
            .input('SystemIntegratorId', sql.Int, req.body.SystemIntegratorId)
            .input('PlazaName', sql.VarChar(100), req.body.PlazaName)
            .input('PlazaServerIpAddress', sql.VarChar(20), req.body.PlazaServerIpAddress)
            .input('PlazaZoneId', sql.VarChar(20), req.body.PlazaZoneId)
            .input('ChainageNumber', sql.Decimal, req.body.ChainageNumber)
            .input('Latitude', sql.Decimal, req.body.Latitude)
            .input('Longitude', sql.Decimal, req.body.Longitude)
            .input('DataStatus', sql.Int, req.body.DataStatus)
            .input('CreatedBy', sql.Int, req.body.CreatedBy)
            .input('ModifiedBy', sql.Int, req.body.CreatedBy)
            .input('CreatedDate', sql.DateTime, req.body.CreatedDate)
            .input('ModifiedDate', sql.DateTime, req.body.ModifiedDate)
            .execute('USP_PlazaInsertUpdate');
        await database.disconnect();
        let out = constants.ResponseMessageList(result.recordset, null);
        res.status(200).json(out)
    } catch (error) {
        let out = constants.ResponseMessage(error.message, null);
        res.status(400).json(out);
    }
}

async function PlazaGetAll(req, res, next) {
    try {
        const pool = await database.connect();
        result = await pool.request().execute('USP_PlazaGetAll');
        await database.disconnect();
        let out = constants.ResponseMessage("success", result.recordset);
        res.status(200).json(out)
    } catch (error) {
        let out = constants.ResponseMessage(error.message, null);
        res.status(400).json(out);
    }
}
async function PlazaGetActive(req, res, next) {
    try {
        const pool = await database.connect();
        result = await pool.request().execute('USP_PlazaGetActive');
        await database.disconnect();
        let out = constants.ResponseMessage("success", result.recordset);
        res.status(200).json(out)
    } catch (error) {
        let out = constants.ResponseMessage(error.message, null);
        res.status(400).json(out);
    }
}

async function PlazaGetById(req, res, next) {
    try {
        const PlazaId = req.query.PlazaId | 0;
        const pool = await database.connect();
        result = await pool.request().input('PlazaId', sql.Int, PlazaId)
            .execute('USP_PlazaGetbyId');
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