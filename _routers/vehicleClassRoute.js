const express = require('express');
const router = express.Router();
const database = require('../_helpers/db');
const constants = require("../_helpers/constants");
const sql = require('mssql');

router.post('/FasTagVehicleClassInsertUpdate', FasTagVehicleClassInsertUpdate);
router.post('/SystemVehicleClassInsertUpdate', SystemVehicleClassInsertUpdate);

router.get('/FasTagVehicleClassGetAll', FasTagVehicleClassGetAll);
router.get('/FasTagVehicleClassGetActive', FasTagVehicleClassGetActive);
router.get('/FasTagVehicleClassGetById', FasTagVehicleClassGetById);

router.get('/SystemVehicleClassGetAll', SystemVehicleClassGetAll);
router.get('/SystemVehicleClassGetActive', SystemVehicleClassGetActive);
router.get('/SystemVehicleClassGetById', SystemVehicleClassGetById);
module.exports = router;

async function FasTagVehicleClassInsertUpdate(req, res, next) {
    try {
        const pool = await database.connect();
        result = await pool.request().input('FasTagVehicleClassId', sql.Int, req.body.FasTagVehicleClassId)
            .input('FasTagVehicleClassName', sql.VarChar(100), req.body.FasTagVehicleClassName)
            .input('FasTagVehicleClassDescription', sql.VarChar(100), req.body.FasTagVehicleClassDescription)
            .input('PermissibleWeight', sql.Decimal, req.body.PermissibleWeight)
            .input('DataStatus', sql.Int, req.body.DataStatus)
            .input('CreatedBy', sql.Int, req.body.CreatedBy)
            .input('ModifiedBy', sql.Int, req.body.CreatedBy)
            .input('CreatedDate', sql.DateTime, req.body.CreatedDate)
            .input('ModifiedDate', sql.DateTime, req.body.ModifiedDate)
            .execute('USP_FasTagVehicleClassInsertUpdate');
        await database.disconnect();
        let out = constants.ResponseMessageList(result.recordset, null);
        res.status(200).json(out)
    } catch (error) {
        let out = constants.ResponseMessage(error.message, null);
        res.status(400).json(out);
    }
}

async function SystemVehicleClassInsertUpdate(req, res, next) {
    try {
        const pool = await database.connect();
        result = await pool.request().input('SystemVehicleClassId', sql.Int, req.body.SystemVehicleClassId)
            .input('SystemVehicleClassName', sql.VarChar(100), req.body.SystemVehicleClassName)
            .input('SystemVehicleClassDescription', sql.VarChar(100), req.body.SystemVehicleClassDescription)
            .input('PermissibleWeight', sql.Decimal, req.body.PermissibleWeight)
            .input('SystemSubClassIds', sql.VarChar(4000), req.body.SystemSubClassIds)
            .input('DataStatus', sql.Int, req.body.DataStatus)
            .input('CreatedBy', sql.Int, req.body.CreatedBy)
            .input('ModifiedBy', sql.Int, req.body.CreatedBy)
            .input('CreatedDate', sql.DateTime, req.body.CreatedDate)
            .input('ModifiedDate', sql.DateTime, req.body.ModifiedDate)
            .execute('USP_SystemVehicleClassInsertUpdate');
        await database.disconnect();
        let out = constants.ResponseMessageList(result.recordset, null);
        res.status(200).json(out)
    } catch (error) {
        let out = constants.ResponseMessage(error.message, null);
        res.status(400).json(out);
    }
}

async function FasTagVehicleClassGetAll(req, res, next) {
    try {
        const pool = await database.connect();
        result = await pool.request().execute('USP_FasTagVehicleClassGetAll');
        await database.disconnect();
        let out = constants.ResponseMessage("success", result.recordset);
        res.status(200).json(out)
    } catch (error) {
        let out = constants.ResponseMessage(error.message, null);
        res.status(400).json(out);
    }
}

async function FasTagVehicleClassGetActive(req, res, next) {
    try {
        const pool = await database.connect();
        result = await pool.request().execute('USP_FasTagVehicleClassGetActive');
        await database.disconnect();
        let out = constants.ResponseMessage("success", result.recordset);
        res.status(200).json(out)
    } catch (error) {
        let out = constants.ResponseMessage(error.message, null);
        res.status(400).json(out);
    }
}

async function FasTagVehicleClassGetById(req, res, next) {
    try {
        const FasTagVehicleClassId = req.query.FasTagVehicleClassId | 0;
        const pool = await database.connect();
        result = await pool.request().input('FasTagVehicleClassId', sql.Int, FasTagVehicleClassId)
            .execute('USP_FasTagVehicleClassGetById');
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

async function SystemVehicleClassGetAll(req, res, next) {
    try {
        const pool = await database.connect();
        result = await pool.request().execute('USP_SystemVehicleClassGetAll');
        await database.disconnect();
        let out = constants.ResponseMessage("success", result.recordset);
        res.status(200).json(out)
    } catch (error) {
        let out = constants.ResponseMessage(error.message, null);
        res.status(400).json(out);
    }
}

async function SystemVehicleClassGetActive(req, res, next) {
    try {
        const pool = await database.connect();
        result = await pool.request().execute('USP_SystemVehicleClassGetActive');
        await database.disconnect();
        let out = constants.ResponseMessage("success", result.recordset);
        res.status(200).json(out)
    } catch (error) {
        let out = constants.ResponseMessage(error.message, null);
        res.status(400).json(out);
    }
}

async function SystemVehicleClassGetById(req, res, next) {
    try {
        const SystemVehicleClassId = req.query.SystemVehicleClassId | 0;
        const pool = await database.connect();
        result = await pool.request().input('SystemVehicleClassId', sql.Int, SystemVehicleClassId)
            .execute('USP_SystemVehicleClassGetById');
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