const express = require('express');
const router = express.Router();
const database = require('../_helpers/db');
const constants = require("../_helpers/constants");
const sql = require('mssql');

router.post('/EquipmentDetailsInsertUpdate', EquipmentDetailsInsertUpdate);

router.get('/EquipmentDetailsGetAll', EquipmentDetailsGetAll);
router.get('/EquipmentDetailsGetActive', EquipmentDetailsGetActive);
router.get('/EquipmentDetailsGetById', EquipmentDetailsGetById);
router.get('/EquipmentTypeGetActive', EquipmentTypeGetActive);
module.exports = router;

async function EquipmentDetailsInsertUpdate(req, res, next) {
    try {
        const pool = await database.connect();
        result = await pool.request().input('EquipmentId', sql.BigInt, req.body.EquipmentId)
            .input('PlazaId', sql.Int, req.body.PlazaId)
            .input('LaneId', sql.Int, req.body.LaneId)
            .input('EquipmentTypeId', sql.Int, req.body.EquipmentTypeId)
            .input('ProtocolTypeId', sql.Int, req.body.ProtocolTypeId)
            .input('EquipmentName', sql.VarChar(200), req.body.EquipmentName)
            .input('IpAddress', sql.VarChar(20), req.body.IpAddress)
            .input('PortNumber', sql.Int, req.body.PortNumber)
            .input('LoginId', sql.VarChar(50), req.body.LoginId)
            .input('LoginPassword', sql.VarChar(50), req.body.LoginId)
            .input('MacAddress', sql.VarChar(100), req.body.MacAddress)
            .input('SerialNumber', sql.VarChar(100), req.body.SerialNumber)
            .input('ModelNumber', sql.VarChar(100), req.body.ModelNumber)
            .input('ManufactureId', sql.SmallInt, req.body.ManufactureId)
            .input('ManufacturerDate', sql.VarChar(20), req.body.ManufacturerDate)
            .input('PurchageDate', sql.VarChar(20), req.body.PurchageDate)
            .input('WarrantyExpireDate', sql.VarChar(20), req.body.WarrantyExpireDate)
            .input('DataStatus', sql.Int, req.body.DataStatus)
            .input('CreatedBy', sql.Int, req.body.CreatedBy)
            .input('ModifiedBy', sql.Int, req.body.CreatedBy)
            .input('CreatedDate', sql.DateTime, req.body.CreatedDate)
            .input('ModifiedDate', sql.DateTime, req.body.ModifiedDate)
            .execute('USP_EquipmentDetailsInsertUpdate');
        await database.disconnect();
        let out = constants.ResponseMessageList(result.recordset, null);
        res.status(200).json(out)
    } catch (error) {
        let out = constants.ResponseMessage(error.message, null);
        res.status(400).json(out);
    }
}


async function EquipmentDetailsGetAll(req, res, next) {
    try {
        const pool = await database.connect();
        result = await pool.request().execute('USP_EquipmentDetailsGetAll');
        await database.disconnect();
        let out = constants.ResponseMessage("success", result.recordset);
        res.status(200).json(out)
    } catch (error) {
        let out = constants.ResponseMessage(error.message, null);
        res.status(400).json(out);
    }
}

async function EquipmentDetailsGetActive(req, res, next) {
    try {
        const pool = await database.connect();
        result = await pool.request().execute('USP_EquipmentDetailsGetActive');
        await database.disconnect();
        let out = constants.ResponseMessage("success", result.recordset);
        res.status(200).json(out)
    } catch (error) {
        let out = constants.ResponseMessage(error.message, null);
        res.status(400).json(out);
    }
}

async function EquipmentDetailsGetById(req, res, next) {
    try {
        const EquipmentId = req.query.EquipmentId | 0;
        const pool = await database.connect();
        result = await pool.request().input('EquipmentId', sql.Int, EquipmentId)
            .execute('USP_EquipmentDetailsGetById');
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

async function EquipmentTypeGetActive(req, res, next) {
    try {
        const pool = await database.connect();
        result = await pool.request().execute('USP_EquipmentTypeMasterGetActive');
        await database.disconnect();
        let out = constants.ResponseMessage("success", result.recordset);
        res.status(200).json(out)
    } catch (error) {
        let out = constants.ResponseMessage(error.message, null);
        res.status(400).json(out);
    }
}