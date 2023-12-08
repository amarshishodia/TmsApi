const express = require('express');
const router = express.Router();
const database = require('../_helpers/db');
const constants = require("../_helpers/constants");
const sql = require('mssql');
const moment = require('moment');

router.get('/ShiftTiminingAll', ShiftTiminingGetAll);
router.get('/ShiftTiminingGetActive', ShiftTiminingGetActive);
router.get('/ShiftTiminingGetById', ShiftTiminingGetById);
router.get('/ShiftTiminingGetByDateTime', ShiftTiminingGetByDateTime);
router.get('/ShiftStatusGetAll', ShiftStatusGetAll);
router.get('/ShiftStatusGetOpen', ShiftStatusGetOpen);
router.get('/ShiftStatusGetClose', ShiftStatusGetClose);

module.exports = router;

async function ShiftTiminingGetAll(req, res, next) {
    try {
        const pool = await database.connect();
        result = await pool.request().execute('USP_ShiftTiminingGetAll');
        await database.disconnect();
        let out = constants.ResponseMessage("success", result.recordset);
        res.status(200).json(out);
    } catch (error) {
        let out = constants.ResponseMessage(error.message, null);
        res.status(400).json(out);
    }
}

async function ShiftTiminingGetActive(req, res, next) {
    try {
        const pool = await database.connect();
        result = await pool.request().execute('USP_ShiftTiminingGetActive');
        await database.disconnect();
        let out = constants.ResponseMessage("success", result.recordset);
        res.status(200).json(out);
    } catch (error) {
        let out = constants.ResponseMessage(error.message, null);
        res.status(400).json(out);
    }
}

async function ShiftTiminingGetById(req, res, next) {
    try {
        const ShiftId = req.query.ShiftId | 0;
        const pool = await database.connect();
        result = await pool.request().input('ShiftId', sql.Int, ShiftId)
            .execute('USP_ShiftTiminingGetById');
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

async function ShiftTiminingGetByDateTime(req, res, next) {
    try {
        const pool = await database.connect();
        result = await pool.request().input('ShiftDateTime', sql.VarChar(50), req.query.ShiftDateTime)
            .execute('USP_ShiftGetByDateTime');
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

async function ShiftStatusGetAll(req, res, next) {
    try {
        const pool = await database.connect();
        result = await pool.request().execute('USP_ShiftStatusGetAll');
        await database.disconnect();
        var dataresult = [];
        let dataarray = result.recordset;
        for (let index = 0; index < dataarray.length; index++) {
            dataresult.push(ShiftStatusGetdata(dataarray[index]));
        }
        let out = constants.ResponseMessage("success", dataresult);
        res.status(200).json(out);
    } catch (error) {
        let out = constants.ResponseMessage(error.message, null);
        res.status(400).json(out);
    }
}

async function ShiftStatusGetOpen(req, res, next) {
    try {
        const pool = await database.connect();
        result = await pool.request().execute('USP_ShiftStatusGetOpen');
        await database.disconnect();

        var dataresult = [];
        let dataarray = result.recordset;
        for (let index = 0; index < dataarray.length; index++) {
            dataresult.push(ShiftStatusGetdata(dataarray[index]));
        }
        let out = constants.ResponseMessage("success", dataresult);
        res.status(200).json(out);
    } catch (error) {
        let out = constants.ResponseMessage(error.message, null);
        res.status(400).json(out);
    }
}

async function ShiftStatusGetClose(req, res, next) {
    try {
        const pool = await database.connect();
        result = await pool.request().execute('USP_ShiftStatusGetClose');
        await database.disconnect();
        var dataresult = [];
        let dataarray = result.recordset;
        for (let index = 0; index < dataarray.length; index++) {
            dataresult.push(ShiftStatusGetdata(dataarray[index]));
        }
        let out = constants.ResponseMessage("success", dataresult);
        res.status(200).json(out);
    } catch (error) {
        let out = constants.ResponseMessage(error.message, null);
        res.status(400).json(out);
    }
}

function ShiftStatusGetdata(dataarray) {
    const data = {
        ShiftStatusId: dataarray.ShiftStatusId,
        PlazaId: dataarray.PlazaId,
        PlazaName: dataarray.PlazaName,
        ShiftId: dataarray.ShiftId,
        ShiftNumber: "Shift-" + dataarray.ShiftId,
        StartTimmng: dataarray.StartTimmng,
        EndTimming: dataarray.EndTimming,
        ShiftDate: dataarray.ShiftDate,
        ShiftDateStamp: moment(dataarray.ShiftDate).format('DD-MMM-YYYY HH:mm:ss'),
        ShiftStatus: dataarray.ShiftStatus,
        LaneTransactionCount: dataarray.LaneTransactionCount,
        FloatDeclare: dataarray.FloatDeclare,
        MidDeclare: dataarray.MidDeclare,
        EndDeclare: dataarray.EndDeclare,
        SystemDeclare: dataarray.SystemDeclare,
        DifferenceAmount: dataarray.DifferenceAmount,
        DataStatus: dataarray.DataStatus,
        CreatedDate: dataarray.CreatedDate,
        CreatedBy: dataarray.CreatedBy,
        ModifiedDate: dataarray.ModifiedDate,
        ModifiedBy: dataarray.ModifiedBy
    }
    return data;
}