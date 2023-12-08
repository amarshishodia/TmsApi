const fs = require('fs').promises;
const crypto = require('crypto');
const AppProvider = "Softomation";
const mkdirp = require('mkdirp');
//#region For encryption and decryption
const issuer = "http://www.softomation.com";
const passPhrase = "$0ft0m@ti0n";//Pas5pr@se        // can be any string
const saltValue = "HP5502@$";//s@1tValue        // can be any string
const hashAlgorithm = "SHA1";             // can be "MD5"
const passwordIterations = 2;                  // can be any number
const initVector = "@1B2c3D4e5F6g7H8"; // must be 16 bytes
const keySize = 256;                // can be 192 or 128
const JWTkey = AppProvider + "HighwaySoluationsProvider";
//#endregion

function ResponseMessageList(model, Data) {
    let msg = [];
    for (let i = 0; i < model.length; i++) {
        msg.push({ AlertMessage: model[i].AlertMessage })
    }

    let out = {
        Message: msg,
        ResponseData: Data
    }
    return out;
}

function RandonString(length){
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}

function ResponseMessage(model, Data) {
    let out = {
        Message: [{ AlertMessage: model }],
        ResponseData: Data
    }
    return out;
}

function randomUUID() {
    return crypto.randomUUID();
}
function CreateDirectory(directoryPath) {
    // fs.access(path, (error) => {
    //     if (error) {
    //         fs.mkdir(path, { recursive: true }, (error) => {
    //             if (error) {
    //                 return false;
    //             } else {
    //                 return true;
    //             }
    //         });
    //     } else {
    //         return true;
    //     }
    // });
    fs.mkdir(directoryPath, { recursive: true })
        .then(() => {
            console.log(`Directory created: ${directoryPath}`);
        })
        .catch((err) => {
            console.error(err);
        });
}
function SaveImage(base64String, filePath, filename, ext, path) {
    try {
        let preExt = "";
        let fileType = "";
        if (base64String != "") {
            filePath = filePath + filename + ext;
            if (base64String.startsWith("data:")) {
                preExt = base64String.split(',')[0];
                preExt = preExt.split(';')[0];
                preExt = preExt.replace("data:", "");
                const fileDetails = preExt.split('/');
                preExt = fileDetails[1];
                fileType = fileDetails[0];
                base64String = base64String.split(',')[1];
            }
            if (preExt != "")
                filePath = filePath.replace(ext, "." + preExt);
            const imageBuffer = Buffer.from(base64String, 'base64');
            fs.writeFile(filePath, imageBuffer, (err) => {
                if (err) {
                    filePath= "";
                } 
            });
        }
        else
        filePath= "";
    } catch (error) {
        filePath= "";
    }
    return filePath
}

module.exports = {
    ResponseMessageList,
    ResponseMessage,
    SaveImage,
    randomUUID,
    RandonString,
    AppProvider,
    JWTkey
};