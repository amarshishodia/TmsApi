const express = require('express');
const router = express.Router();
const database = require('../_helpers/db');
const constants = require("../_helpers/constants");
const sql = require('mssql');

router.post('/LaneTranscationInsert', LaneTranscationInsert);
module.exports = router;
async function LaneTranscationInsert(req, res, next) {
    try {
        const pool = await database.connect();
        const MasterTransactionId=0;
        const PlazaTransactionId=0;
        const Cdt=new Date()
        result = await pool.request().input('MasterTransactionId', sql.BigInt, MasterTransactionId)
            .input('PlazaId', sql.BigInt, PlazaTransactionId)
            .input('LaneTransactionId', sql.BigInt, req.body.LaneTransactionId)
            .input('SystemIntegratorId', sql.SmallInt, req.body.SystemIntegratorId)
            .input('JourneyId', sql.SmallInt, req.body.JourneyId)
            .input('PlazaId', sql.SmallInt, req.body.PlazaId)
            .input('LaneId', sql.SmallInt, req.body.LaneId)
            .input('LaneStatusId', sql.Bit, req.body.LaneModeId)
            .input('LaneModeId', sql.Bit, req.body.LaneModeId)
            .input('ShiftId', sql.SmallInt, req.body.ShiftId)
            .input('TransactionTypeId', sql.SmallInt, req.body.TransactionTypeId)
            .input('PaymentTypeId', sql.SmallInt, req.body.PaymentTypeId)
            .input('ExemptTypeId', sql.SmallInt, req.body.ExemptTypeId)
            .input('ExemptSubTypeId', sql.SmallInt, req.body.ExemptTypeId)
            .input('RCTNumber', sql.VarChar(32), req.body.RCTNumber)
            .input('PlateNumber', sql.VarChar(20), req.body.PlateNumber)
            .input('VehicleClassId', sql.SmallInt, req.body.VehicleClassId)
            .input('VehicleSubClassId', sql.SmallInt, req.body.VehicleSubClassId)
            .input('VehicleAvcClassId', sql.SmallInt, req.body.VehicleAvcClassId)
            .input('EPC', sql.VarChar(32), req.body.EPC)
            .input('TagClassId', sql.SmallInt, req.body.TagClassId)
            .input('TagPlateNumber', sql.VarChar(20), req.body.TagPlateNumber)
            .input('TagReadDateTime', sql.DateTime2, req.body.TagReadDateTime)
            .input('TagReadCount', sql.Bit, req.body.TagReadCount)
            .input('IsReadByReader', sql.Bit, req.body.IsReadByReader)
            .input('PermissibleVehicleWeight', sql.Decimal, req.body.PermissibleVehicleWeight)
            .input('ActualVehicleWeight', sql.Decimal, req.body.ActualVehicleWeight)
            .input('IsOverWeightCharged', sql.Bit, req.body.IsOverWeightCharged)
            .input('OverWeightAmount', sql.Decimal, req.body.OverWeightAmount)
            .input('TagPenaltyAmount', sql.Decimal, req.body.TagPenaltyAmount)
            .input('TransactionAmount', sql.Decimal, req.body.TransactionAmount)
            .input('TransactionDateTime', sql.DateTime2, req.body.TransactionDateTime)
            .input('TransactionFrontImage', sql.VarChar(255), req.body.TransactionFrontImage)
            .input('TransactionBackImage', sql.VarChar(255), req.body.TransactionBackImage)
            .input('TransactionAvcImage', sql.VarChar(255), req.body.TransactionAvcImage)
            .input('TransactionVideo', sql.VarChar(255), req.body.TransactionVideo)
            .input('ExemptionProofImage', sql.VarChar(255), req.body.ExemptionProofImage)
            .input('DestinationPlazaId', sql.SmallInt, req.body.DestinationPlazaId)
            .input('UserId', sql.SmallInt, req.body.UserId)
            .input('LoginId', sql.VarChar(20), req.body.LoginId)
            .input('IsReturnJourney', sql.Bit, req.body.IsReturnJourney)
            .input('IsExcessJourney', sql.Bit, req.body.IsExcessJourney)
            .input('IsBarrierAutoClose', sql.Bit, req.body.IsBarrierAutoClose)
            .input('IsTowVehicle', sql.Bit, req.body.IsTowVehicle)
            .input('IsFleetTranscation', sql.Bit, req.body.IsFleetTranscation)
            .input('FleetCount', sql.SmallInt, req.body.FleetCount)
            .input('ReceivedDateTime', sql.DateTime2, moment(Cdt).format('DD-MMM-YYYY HH:mm:ss.SSS'))
            .execute('USP_LaneTransactionInsert');
        await database.disconnect();
        let out = constants.ResponseMessageList(result.recordset, null);
        res.status(200).json(out)
    } catch (error) {
        let out = constants.ResponseMessage(error.message, null);
        res.status(400).json(out);
    }
}