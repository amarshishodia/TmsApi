const express = require('express');
const router = express.Router();
const database = require('../_helpers/db');
const constants = require("../_helpers/constants");
const sql = require('mssql');

router.post('/ExemptTypeUpdate', ExemptTypeUpdate);

router.get('/ExemptTypeGetAll', ExemptTypeGetAll);
router.get('/ExemptTypeGetActive', ExemptTypeGetActive);

module.exports = router;

async function ExemptTypeUpdate(req, res, next) {
    try {
        const SessionId = constants.RandonString(10)
        const array = req.body;
        const table = new sql.Table('temp_ExemptTypeMaster');
        table.create = true;
        table.columns.add('ExemptTypeId', sql.SmallInt, { nullable: false });
        table.columns.add('DataStatus', sql.SmallInt, { nullable: false });
        table.columns.add('SessionId', sql.VarChar(20), { nullable: false });
        for (let i = 0; i < array.length; i++) {
            table.rows.add(
                parseInt(array[i].ExemptTypeId),
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
            .execute('USP_ExemptTypeUpdate');
        await database.disconnect();
        let out = constants.ResponseMessageList(result.recordset, null);
        res.status(200).json(out)
    } catch (error) {
        let out = constants.ResponseMessage(error.message, null);
        res.status(400).json(out);
    }
}

async function ExemptTypeGetAll(req, res, next) {
    try {
        const pool = await database.connect();
        result = await pool.request().execute('USP_ExemptTypeMasterGetAll');
        await database.disconnect();
        let out = constants.ResponseMessage("success", result.recordset);
        res.status(200).json(out);
    } catch (error) {
        let out = constants.ResponseMessage(error.message, null);
        res.status(400).json(out);
    }
}

async function ExemptTypeGetActive(req, res, next) {
    try {
        const pool = await database.connect();
        result = await pool.request().execute('USP_ExemptTypeMasterGetActive');
        await database.disconnect();
        let out = constants.ResponseMessage("success", result.recordset);
        res.status(200).json(out);
    } catch (error) {
        let out = constants.ResponseMessage(error.message, null);
        res.status(400).json(out);
    }
}