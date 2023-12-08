const express = require('express');
const router = express.Router();
const database = require('../_helpers/db');
const constants = require("../_helpers/constants");
const sql = require('mssql');

router.post('/PaymentMethodTypeUpdate', PaymentMethodTypeUpdate);

router.get('/PaymentMethodTypeGetAll', PaymentMethodTypeGetAll);
router.get('/PaymentMethodTypeGetActive', PaymentMethodTypeGetActive);

module.exports = router;

async function PaymentMethodTypeUpdate(req, res, next) {
    try {
        const SessionId = constants.RandonString(10)
        const array = req.body;
        const table = new sql.Table('temp_PaymentTypeMaster');
        table.create = true;
        table.columns.add('PaymentTypeId', sql.SmallInt, { nullable: false });
        table.columns.add('TransactionTypeId', sql.SmallInt, { nullable: false });
        table.columns.add('DataStatus', sql.SmallInt, { nullable: false });
        table.columns.add('SessionId', sql.VarChar(20), { nullable: false });
        for (let i = 0; i < array.length; i++) {
            table.rows.add(
                parseInt(array[i].PaymentTypeId),
                parseInt(array[i].TransactionTypeId),
                parseInt(array[i].DataStatus),
                SessionId);
        }
        const pool = await database.connect();
        const resultU = await pool.request().bulk(table);
        result = await pool.request().input('SessionId', sql.VarChar(20), SessionId)
            .input('CreatedBy', sql.Int, array[0].CreatedBy)
            .input('ModifiedBy', sql.Int, array[0].CreatedBy)
            .input('CreatedDate', sql.DateTime, array[0].CreatedDate)
            .input('ModifiedDate', sql.DateTime, array[0].ModifiedDate)
            .execute('USP_PaymentTypeUpdate');
        await database.disconnect();
        let out = constants.ResponseMessageList(result.recordset, null);
        res.status(200).json(out)
    } catch (error) {
        let out = constants.ResponseMessage(error.message, null);
        res.status(400).json(out);
    }
}

async function PaymentMethodTypeGetAll(req, res, next) {
    try {
        const pool = await database.connect();
        result = await pool.request().execute('USP_PaymentTypeGetAll');
        await database.disconnect();
        let out = constants.ResponseMessage("success", result.recordset);
        res.status(200).json(out);
    } catch (error) {
        let out = constants.ResponseMessage(error.message, null);
        res.status(400).json(out);
    }
}

async function PaymentMethodTypeGetActive(req, res, next) {
    try {
        const pool = await database.connect();
        result = await pool.request().execute('USP_PaymentTypeGetActive');
        await database.disconnect();
        let out = constants.ResponseMessage("success", result.recordset);
        res.status(200).json(out);
    } catch (error) {
        let out = constants.ResponseMessage(error.message, null);
        res.status(400).json(out);
    }
}