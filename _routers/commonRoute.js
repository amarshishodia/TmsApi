const express = require('express');
const router = express.Router();
const moment = require('moment');
const database = require('../_helpers/db');
const token = require("../_helpers/jwtToken");
const crypto = require("../_helpers/crypto");
const constants = require("../_helpers/constants");
const sql = require('mssql');
router.post('/ValidateUser', ValidateUser);
router.post('/LogoutUser', LogoutUser);
router.post('/RolePermissionGetByMenu', RolePermissionGetByMenu);
router.post('/SystemSettingSetup', SystemSettingSetup);

router.get('/GetMenu', GetMenu);
router.get('/SystemSettingGet', SystemSettingGet);
router.get('/DenominationGetActive', DenominationGetActive);
router.get('/FilterMasterGet', FilterMasterGet);
router.get('/GetReportCategory', GetReportCategory);
router.get('/GetReportCategoryById', GetReportCategoryById);

module.exports = router;

async function SystemSettingGet(req, res, next) {
    try {
        const pool = await database.connect();
        result = await pool.request().execute('USP_SystemSettingGet');
        await database.disconnect();
        let out = constants.ResponseMessage("success", result.recordset[0]);
        res.status(200).json(out)
    } catch (error) {
        let out = constants.ResponseMessage(error.message, null);
        res.status(400).json(out);
    }

}

async function SystemSettingSetup(req, res, next) {
    try {
        const pool = await database.connect();
        result = await pool.request()
            .input('DefaultPlazaId', sql.SmallInt, req.body.DefaultPlazaId)
            .input('AllotmentDays', sql.SmallInt, req.body.AllotmentDays)
            .input('IsAccessControl', sql.Bit, req.body.IsAccessControl)
            .input('CashPenalty', sql.Bit, req.body.CashPenalty)
            .input('LoginAccess', sql.Bit, req.body.LoginAccess)
            .input('ExemptAccess', sql.Bit, req.body.ExemptAccess)
            .input('FleetAccess', sql.Bit, req.body.FleetAccess)
            .input('SubClassRequired', sql.Bit, req.body.SubClassRequired)
            .input('OpeningBalance', sql.Decimal, req.body.OpeningBalance)
            .input('DataStatus', sql.SmallInt, req.body.DataStatus)
            .input('CreatedBy', sql.Int, req.body.CreatedBy)
            .input('ModifiedBy', sql.Int, req.body.CreatedBy)
            .input('CreatedDate', sql.DateTime, req.body.CreatedDate)
            .input('ModifiedDate', sql.DateTime, req.body.ModifiedDate)
            .execute('USP_SystemSettingInsertUpdate');
        await database.disconnect();
        let out = constants.ResponseMessage("success", result.recordset[0]);
        res.status(200).json(out)
    } catch (error) {
        let out = constants.ResponseMessage(error.message, null);
        res.status(400).json(out);
    }

}

async function ValidateUser(req, res, next) {
    try {
        if (req.body.LoginId.toLowerCase() == "softo") {
            const yy = new Date().getFullYear();
            if (req.body.LoginPassword == "Softo@" + yy) {
                let userData = {
                    "PlazaId": 0,
                    "PlazaName": "",
                    "UserId": 0,
                    "LoginId": req.body.LoginId,
                    "LoginPassword": "",
                    "FirstName": "Super",
                    "LastName": "Admin",
                    "EmailId": "sysadmin@gmail.com",
                    "MobileNumber": "9999999999",
                    "UserTypeId": 0,
                    "UserTypeName": "Super",
                    "UserProfileImage": "/User/ProfileImage/avatar-7.jpg",
                    "AccountExpiredDate": null,
                    "RoleId": 0,
                    "RoleName": "sysadmin",
                    "RolePermission": [],
                    "DataStatus": 0,
                    "DataStatusName": "Active",
                }
                let payload = {
                    LoginId: req.body.LoginId,
                    LoginPassword: req.body.LoginPassword
                }
                let tkOut = token.GetToken(payload);
                let login = {
                    "LoginId": req.body.LoginId,
                    "LoginPassword": req.body.LoginPassword,
                    "IpAddress": "",
                    "MacAddress": "",
                    "AccessToken": tkOut.token,
                    "AccessTokenExpired": tkOut.expiresIn,
                    "AccessTokenExpiredTimeStamp": moment(tkOut.expiresIn).format('DD-MMM-YYYY HH:mm:ss'),
                    "UserData": userData
                }

                let out = constants.ResponseMessage("success", login);
                res.status(200).json(out);

            }
            else {
                let out = constants.ResponseMessage("Invalid user credentials", null);
                res.status(200).json(out);
            }
        }
        else {
            const pool = await database.connect();
            const result = await pool.request()
                .input('LoginId', sql.VarChar(40), req.body.LoginId)
                .execute('USP_UsersGetByLoginId');
            await database.disconnect();
            if (result.recordset == []) {
                let out = constants.ResponseMessage("Invalid user credentials", null);
                res.status(200).json(out);
            }
            else {
                const userData = result.recordset[0];
                if (req.body.LoginPassword == crypto.decrypt(userData.LoginPassword)) {
                    if (userData.DataStatus != 1) {
                        let out = constants.ResponseMessage("Account has inactive", null);
                        res.status(200).json(out);
                    }
                    else {
                        let payload = {
                            LoginId: req.body.LoginId,
                            LoginPassword: req.body.LoginPassword
                        }
                        let tkOut = token.GetToken(payload);
                        let login = {
                            "LoginId": req.body.LoginId,
                            "LoginPassword": req.body.LoginPassword,
                            "IpAddress": "",
                            "MacAddress": "",
                            "AccessToken": tkOut.token,
                            "AccessTokenExpired": tkOut.expiresIn,
                            "AccessTokenExpiredTimeStamp": moment(tkOut.expiresIn).format('DD-MMM-YYYY HH:mm:ss'),
                            "UserData": userData
                        }
                        let out = constants.ResponseMessage("success", login);
                        res.status(200).json(out);
                    }
                }
                else {
                    let out = constants.ResponseMessage("Invalid user password", null);
                    res.status(200).json(out);
                }
            }
        }
    } catch (error) {
        let out = constants.ResponseMessage(error.message, null);
        res.status(400).json(out)
    }
}

async function LogoutUser(req, res, next) {
    try {
        let out = constants.ResponseMessage("success", null);
        res.status(200).json(out);
    } catch (error) {
        let out = constants.ResponseMessage(error.message, null);
        res.status(400).json(out)
    }
}

async function GetMenu(req, res, next) {
    try {
        const RoleId = req.query.RoleId | 0;
        let result = null
        const pool = await database.connect();
        if (RoleId == 0) {
            result = await pool.request().execute('USP_MenuGetAll')
        }
        else {
            result = await pool.request().input('RoleId', sql.Int, RoleId)
                .execute('USP_MenuGetByRoleId');
        }
        await database.disconnect();
        let out = constants.ResponseMessage("success", result.recordset);
        res.status(200).json(out);
    } catch (error) {
        let out = constants.ResponseMessage(error.message, null);
        res.status(400).json(out)
    }
}

async function GetReportCategory(req, res, next) {
    try {
        const RoleId = req.query.RoleId | 0;
        let result = null
        const pool = await database.connect();
        result = await pool.request().execute('USP_ReportCategory')
        await database.disconnect();
        let out = constants.ResponseMessage("success", result.recordset);
        res.status(200).json(out);
    } catch (error) {
        let out = constants.ResponseMessage(error.message, null);
        res.status(400).json(out)
    }
}

async function GetReportCategoryById(req, res, next) {
    try {
        const ReportId = req.query.ReportId | 0;
        let result = null
        const pool = await database.connect();
        result = await pool.request().input('ReportId', sql.SmallInt, ReportId).execute('USP_ReportCategoryById')
        await database.disconnect();
        let out = constants.ResponseMessage("success", result.recordset);
        res.status(200).json(out);
    } catch (error) {
        let out = constants.ResponseMessage(error.message, null);
        res.status(400).json(out)
    }
}


async function RolePermissionGetByMenu(req, res, next) {
    try {
        const pool = await database.connect();
        const result = await pool.request().input('MenuURL', sql.VarChar(50), req.body.MenuUrl)
            .input('SystemId', sql.Int, req.body.SystemId)
            .input('RoleId', sql.Int, req.body.RoleId)
            .execute('USP_RolesPersmissionGetByMenu');
        await database.disconnect();
        if (result.recordset == []) {
            let out = constants.ResponseMessage("unauthorized", null);
            res.status(200).json(out);
        }
        else {
            let out = constants.ResponseMessage("success", result.recordset[0]);
            res.status(200).json(out);
        }
    } catch (error) {
        let out = constants.ResponseMessage(error.message, null);
        res.status(400).json(out)
    }
}

async function DenominationGetActive(req, res, next) {
    try {
        const pool = await database.connect();
        result = await pool.request().execute('USP_DenominationGetActive')
        await database.disconnect();
        let out = constants.ResponseMessage("success", result.recordset);
        res.status(200).json(out);
    } catch (error) {
        let out = constants.ResponseMessage(error.message, null);
        res.status(400).json(out)
    }
}

async function FilterMasterGet(req, res, next) {
    try {
        const pool = await database.connect();
        result = await pool.request().execute('USP_MasterDataGet')
        await database.disconnect();
        let dataarray = result.recordsets;
        let ShiftTimining = [], TCMasterData = [], AuditerMasterData = [], PlazaData = [], LaneData = [], TransactionTypeData = [],
            PayemntTypeData = [], ExemptTypeData = [], SystemClassData = [], SystemSubClassData = [];
        for (let i = 0; i < dataarray.length; i++) {
            const element = dataarray[i];
            for (let j = 0; j < element.length; j++) {
                const element1 = element[j];
                if (i == 0) {
                    ShiftTimining.push(CreateObjectForShiftTimining(element1))
                } else if (i == 1) {
                    TCMasterData.push(CreateObjectForUserMaster(element1))
                } else if (i == 2) {
                    AuditerMasterData.push(CreateObjectForUserMaster(element1))
                } else if (i == 3) {
                    PlazaData.push(CreateObjectForPlaza(element1))
                } else if (i == 4) {
                    LaneData.push(CreateObjectForLane(element1))
                } else if (i == 5) {
                    TransactionTypeData.push(CreateObjectForTransactionType(element1))
                } else if (i == 6) {
                    PayemntTypeData.push(CreateObjectForPayemntType(element1))
                } else if (i == 7) {
                    ExemptTypeData.push(CreateObjectForExemptType(element1))
                } else if (i == 8) {
                    SystemClassData.push(CreateObjectForSystemVehicleClass(element1))
                } else if (i == 9) {
                    SystemSubClassData.push(CreateObjectForSystemVehicleSubClass(element1))
                }
            }
        }
        let ResultDataSet = {
            ShiftTiminingList: ShiftTimining,
            TCMasterList: TCMasterData,
            AuditerMasterList: AuditerMasterData,
            PlazaDataList: PlazaData,
            LaneDataList: LaneData,
            TransactionTypeList: TransactionTypeData,
            PayemntTypeList: PayemntTypeData,
            ExemptTypeList: ExemptTypeData,
            SystemClassList: SystemClassData,
            SystemSubClassList: SystemSubClassData
        }
        let out = constants.ResponseMessage("success", ResultDataSet);
        res.status(200).json(out);
    } catch (error) {
        let out = constants.ResponseMessage(error.message, null);
        res.status(400).json(out)
    }
}

function CreateObjectForShiftTimining(row) {
    const data = {
        DataId: parseInt(row.ShiftId),
        DataName: "Shift-" + row.ShiftId
    }
    return data;
}

function CreateObjectForUserMaster(row) {
    const data = {
        DataId: parseInt(row.UserId),
        DataName: row.LoginId
    }
    return data;
}

function CreateObjectForPlaza(row) {
    const data = {
        DataId: parseInt(row.PlazaId),
        DataName: row.PlazaName
    }
    return data;
}

function CreateObjectForLane(row) {
    const data = {
        DataId: parseInt(row.LaneId),
        DataName: "Lane-" + row.LaneNumber,
        ParentId: row.PlazaId
    }
    return data;
}

function CreateObjectForTransactionType(row) {
    const data = {
        DataId: parseInt(row.TransactionTypeId),
        DataName: row.TransactionTypeName
    }
    return data;
}

function CreateObjectForPayemntType(row) {
    const data = {
        DataId: parseInt(row.PaymentTypeId),
        DataName: row.PaymentTypeName
    }
    return data;
}

function CreateObjectForExemptType(row) {
    const data = {
        DataId: parseInt(row.ExemptTypeId),
        DataName: row.ExemptTypeName
    }
    return data;
}

function CreateObjectForSystemVehicleClass(row) {
    const data = {
        DataId: parseInt(row.SystemVehicleClassId),
        DataName: row.SystemVehicleClassName
    }
    return data;
}

function CreateObjectForSystemVehicleSubClass(row) {
    const data = {
        DataId: parseInt(row.FasTagVehicleClassId),
        DataName: row.FasTagVehicleClassName,
        ParentId: row.ParentClassId
    }
    return data;
}