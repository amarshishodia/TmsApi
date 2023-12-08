const express = require('express');
const router = express.Router();
const database = require('../_helpers/db');
const crypto = require("../_helpers/crypto");
const constants = require("../_helpers/constants");
const path = require('path');
const sql = require('mssql');

router.post('/UserValidatePassword', UserValidatePassword);
router.post('/UserUpdatePassword', UserUpdatePassword);
router.post('/UserConfigurationSetUp', UserConfigurationSetUp);
router.post('/UserProfileChange', UserProfileChange);


router.get('/UserConfigurationGetAll', UserConfigurationGetAll);
router.get('/UserConfigurationGetById', UserConfigurationGetById);
router.get('/UserGetByIdWithPassword', UserGetByIdWithPassword);
router.get('/UserConfigurationGetByUserType', UserConfigurationGetByUserType);
router.get('/UserConfigurationGetBySystemUserType', UserConfigurationGetBySystemUserType);
module.exports = router;


async function UserGetbyId(userId) {
    const pool = await database.connect();
    result = await pool.request().input('UserId', sql.Int, userId)
        .execute('USP_UserGetbyId');
    await database.disconnect();
    return result;
}

async function UserValidatePassword(req, res, next) {
    try {
        const UserId = req.body.UserId | 0;
        result = await UserGetbyId(UserId);
        if (result.recordset != []) {
            const userData = result.recordset[0];
            if (req.body.LoginPassword == crypto.decrypt(userData.LoginPassword)) {
                let out = constants.ResponseMessage("success", userData);
                res.status(200).json(out)
            }
            else {
                let out = constants.ResponseMessage("Invalid user password", null);
                res.status(200).json(out)
            }
        }
        else {
            let out = constants.ResponseMessage("User Details not found", null);
            res.status(200).json(out)
        }

    } catch (error) {
        let out = constants.ResponseMessage(error.message, null);
        res.status(400).json(out)
    }
}

async function UserUpdatePassword(req, res, next) {
    try {
        const pool = await database.connect();
        result = await pool.request().input('UserId', sql.Int, req.body.UserId)
            .input('LoginPassword', sql.VarChar(200), crypto.encrypt(req.body.LoginPassword))
            .input('CDateTime', sql.DateTime, new Date())
            .input('CreatedBy', sql.Int, req.body.CreatedBy)
            .execute('USP_UserUpdatePassword');
        await database.disconnect();
        let out = constants.ResponseMessage("User Details not found", result.recordset);
        res.status(200).json(out)
    } catch (error) {
        let out = constants.ResponseMessage(error.message, null);
        res.status(400).json(out);
    }
}

async function UserConfigurationSetUp(req, res, next) {
    try {
        const pool = await database.connect();
        result = await pool.request().input('UserId', sql.Int, req.body.UserId)
            .input('LoginId', sql.VarChar(40), req.body.LoginId)
            .input('LoginPassword', sql.VarChar(200), crypto.encrypt(req.body.LoginPassword))
            .input('FirstName', sql.VarChar(40), req.body.FirstName)
            .input('LastName', sql.VarChar(40), req.body.LastName)
            .input('EmailId', sql.VarChar(50), req.body.EmailId)
            .input('MobileNumber', sql.VarChar(30), req.body.MobileNumber)
            .input('AccountExpiredDate', sql.VarChar(20), req.body.AccountExpiredDate)
            .input('PlazaId', sql.Int, req.body.PlazaId)
            .input('UserTypeId', sql.Int, req.body.UserTypeId)
            .input('RoleId', sql.Int, req.body.RoleId)
            .input('DataStatus', sql.Int, req.body.DataStatus)
            .input('CreatedBy', sql.Int, req.body.CreatedBy)
            .input('ModifiedBy', sql.Int, req.body.CreatedBy)
            .input('CreatedDate', sql.DateTime, req.body.CreatedDate)
            .input('ModifiedDate', sql.DateTime, req.body.ModifiedDate)
            .execute('USP_UserInsertUpdate');
        await database.disconnect();
        let out = constants.ResponseMessageList(result.recordset, null);
        res.status(200).json(out)
    } catch (error) {
        let out = constants.ResponseMessage(error.message, null);
        res.status(400).json(out);
    }
}

async function UserConfigurationGetAll(req, res, next) {
    try {
        const pool = await database.connect();
        result = await pool.request().execute('USP_UserGetAll');
        await database.disconnect();
        let out = constants.ResponseMessage("success", result.recordset);
        res.status(200).json(out)
    } catch (error) {
        let out = constants.ResponseMessage(error.message, null);
        res.status(400).json(out);
    }

}

async function UserConfigurationGetById(req, res, next) {
    try {
        const userId = req.query.UserId | 0;
        result = await UserGetbyId(userId);
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

async function UserGetByIdWithPassword(req, res, next) {
    try {
        const userId = req.query.UserId | 0;
        result = await UserGetbyId(userId);
        if (result.recordset == []) {
            let out = constants.ResponseMessage("No data found", null);
            res.status(200).json(out);
        }
        else {
            let d=result.recordset[0];
            d.LoginPassword=crypto.decrypt(d.LoginPassword)
            let out = constants.ResponseMessage("success", result.recordset[0]);
            res.status(200).json(out);
        }
    } catch (error) {
        let out = constants.ResponseMessage(error.message, null);
        res.status(400).json(out);
    }
}

async function UserConfigurationGetByUserType(req, res, next) {
    try {
        const UserTypeId = req.query.UserTypeId | 0;
        const pool = await database.connect();
        result = await pool.request().input('UserTypeId', sql.Int, UserTypeId)
            .execute('USP_UserGetByUserTypeId');
        await database.disconnect();
        let out = constants.ResponseMessage("success", result.recordset);
        res.status(200).json(out)
    } catch (error) {
        let out = constants.ResponseMessage(error.message, null);
        res.status(400).json(out);
    }
}

async function UserConfigurationGetBySystemUserType(req, res, next) {
    try {
        const UserTypeId = req.query.UserTypeId | 0;
        const SystemId = req.query.SystemId | 0;
        const pool = await database.connect();
        result = await pool.request().input('UserTypeId', sql.Int, UserTypeId)
            .input('SystemId', sql.Int, SystemId)
            .execute('USP_UserGetBySystemUserTypeId');
        await database.disconnect();
        let out = constants.ResponseMessage("success", result.recordset);
        res.status(200).json(out)
    } catch (error) {
        let out = constants.ResponseMessage(error.message, null);
        res.status(400).json(out);
    }
}

async function UserProfileChange(req, res, next) {
    try {
        const dir='./EventMedia/User/ProfileImage';
        const currentPath = path.resolve('./EventMedia');
        let FilePath = "\\User\\ProfileImage\\";
        FilePath = constants.SaveImage(req.body.UserProfileImage, currentPath + FilePath, constants.randomUUID(), ".png",dir);
        if (FilePath != "") {
            FilePath=FilePath.replace(currentPath,"");
            FilePath=FilePath.replaceAll("\\","/");
            const pool = await database.connect();
            result = await pool.request().input('UserId', sql.Int, req.body.UserId)
                .input('UserProfileImage', sql.VarChar(200), FilePath)
                .execute('USP_UserProfileChange');
            await database.disconnect();
            let out = constants.ResponseMessage(result.recordset, null);
            res.status(200).json(out)
        }
        else {
            let out = constants.ResponseMessage("Error to save image", null);
            res.status(200).json(out)
        }
    } catch (error) {
        let out = constants.ResponseMessage(error.message, null);
        res.status(400).json(out);
    }
}