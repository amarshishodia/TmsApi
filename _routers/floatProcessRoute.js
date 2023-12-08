const express = require('express');
const router = express.Router();
const database = require('../_helpers/db');
const constants = require("../_helpers/constants");
const sql = require('mssql');
const moment = require('moment');

router.post('/FloatProcessSetUp', FloatProcessSetUp);

router.get('/FloatProcessGetAll', FloatProcessGetAll);
router.get('/FloatProcessGetById', FloatProcessGetById);

module.exports = router;

async function FloatProcessSetUp(req, res, next) {
    try {
        const SessionId = constants.RandonString(10)
        const array = req.body.FloatProcessDenominationList;
        const table = new sql.Table('temp_DenominationDetails');
        table.create = true; // If the table doesn't exist, create it

        // Add columns to the table
        table.columns.add('DenominationId', sql.SmallInt, { nullable: false });
        table.columns.add('DenominationValue', sql.SmallInt, { nullable: false });
        table.columns.add('DenominationCount', sql.SmallInt, { nullable: false });
        table.columns.add('SessionId', sql.VarChar(20), { nullable: false });
        for (let i = 0; i < array.length; i++) {
            table.rows.add(parseInt(array[i].DenominationId), array[i].DenominationValue, array[i].DenominationCount, SessionId);
        }
        const pool = await database.connect();
        const resultU = await pool.request().bulk(table);
        const result = await pool.request().input('SessionId', sql.VarChar(200), SessionId)
            .input('FloatProcessId', sql.BigInt, req.body.FloatProcessId)
            .input('PlazaId', sql.SmallInt, req.body.PlazaId)
            .input('LaneId', sql.SmallInt, req.body.LaneId)
            .input('ShiftId', sql.SmallInt, req.body.ShiftId)
            .input('FloatTransactionTypeId', sql.SmallInt, req.body.FloatTransactionTypeId)
            .input('TransactionDate', sql.VarChar(20), req.body.TransactionDate)
            .input('TransactionAmount', sql.Decimal, req.body.TransactionAmount)
            .input('ReceiptNumber', sql.VarChar(20), req.body.ReceiptNumber)
            .input('AssignedBy', sql.BigInt, req.body.AssignedBy)
            .input('AssignedTo', sql.BigInt, req.body.AssignedTo)
            .input('LaneTransactionCount', sql.BigInt, req.body.LaneTransactionCount)
            .input('DataStatus', sql.SmallInt, req.body.DataStatus)
            .input('CreatedBy', sql.Int, req.body.CreatedBy)
            .input('ModifiedBy', sql.Int, req.body.CreatedBy)
            .input('CreatedDate', sql.DateTime, req.body.CreatedDate)
            .input('ModifiedDate', sql.DateTime, req.body.ModifiedDate)
            .execute('USP_FloatProcessInsertUpdate');
        database.disconnect();
        let out = constants.ResponseMessageList(result.recordset, null);
        res.status(200).json(out);
    } catch (error) {
        let out = constants.ResponseMessage(error.message, null);
        res.status(400).json(out)
    }
}

async function FloatProcessGetAll(req, res, next) {
    try {
        const pool = await database.connect();
        result = await pool.request().execute('USP_FloatProcessGetAll');
        await database.disconnect();
        var dataresult = [];
        let dataarray = result.recordset;
        for (let index = 0; index < dataarray.length; index++) {
            //const d=await Getdata(dataarray[index]);
            dataresult.push(await Getdata(dataarray[index]));
        }
        let out = constants.ResponseMessage("success", dataresult);
        res.status(200).json(out)
    } catch (error) {
        let out = constants.ResponseMessage(error.message, null);
        res.status(400).json(out);
    }
}

async function FloatProcessGetById(req, res, next) {
    try {
        const FloatProcessId = req.query.FloatProcessId | 0;
        const pool = await database.connect();
        result = await pool.request().input('FloatProcessId', sql.Int, FloatProcessId)
            .execute('USP_FloatProcessGetById');
        await database.disconnect();
        if (result.recordset == []) {
            let out = constants.ResponseMessage("No data found", null);
            res.status(200).json(out);
        }
        else {
            data = await Getdata(result.recordset[0]);
            let out = constants.ResponseMessage("success", data);
            res.status(200).json(out);
        }
    } catch (error) {
        let out = constants.ResponseMessage(error.message, null);
        res.status(400).json(out);
    }
}

async function FloatProcessDenominationDetails(FloatProcessId) {
    const pool = await database.connect();
    result = await pool.request().input('FloatProcessId', sql.BigInt, FloatProcessId).execute('USP_FloatProcessDenominationGetById');
    await database.disconnect();
    return result.recordset;

}

async function Getdata(dataarray) {
    const data = {
        FloatProcessId: dataarray.FloatProcessId,
        PlazaId: dataarray.PlazaId,
        PlazaName: dataarray.PlazaName,
        LaneId: dataarray.LaneId,
        LaneNumber: "Lane-" + dataarray.LaneNumber,
        ShiftId: dataarray.ShiftId,
        ShiftNumber: "Shift-" + dataarray.ShiftId,
        ShiftTimining: dataarray.StartTimmng + "-" + dataarray.EndTimming,
        FloatTransactionTypeId: dataarray.FloatTransactionTypeId,
        FloatTransactionTypeName: dataarray.FloatTransactionTypeName,
        TransactionDate: dataarray.TransactionDate,
        TransactionDateStamp: moment(dataarray.TransactionDate).format('DD-MMM-YYYY HH:mm:ss'),
        TransactionAmount: dataarray.TransactionAmount,
        ReceiptNumber: dataarray.ReceiptNumber,
        AssignedBy: dataarray.AssignedBy,
        AssignedByLoginId: dataarray.AssignedByLoginId,
        AssignedTo: dataarray.AssignedTo,
        AssignedToLoginId: dataarray.AssignedToLoginId,
        DataStatus: dataarray.DataStatus,
        CreatedDate: dataarray.CreatedDate,
        CreatedBy: dataarray.CreatedBy,
        ModifiedDate: dataarray.ModifiedDate,
        ModifiedBy: dataarray.ModifiedBy,
        FloatProcessDenominationList: await FloatProcessDenominationDetails(dataarray.FloatProcessId),
    }
    return data;
}