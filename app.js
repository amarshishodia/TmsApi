const express = require('express');
const app = express();
const cors = require('cors');
const corsOpts = require('./configCros.json');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOpts));
//Route
let apiPrefix = '/Softomation/FastTrackHighway-TMS/'
let laneApiPrefix = '/Softomation/FTH-TMS-RSD/'
app.use('/EventMedia', express.static('EventMedia/'));
app.use(apiPrefix, require('./_routers/commonRoute'));
app.use(apiPrefix, require('./_routers/commonRoute'));
app.use(apiPrefix, require('./_routers/dashboardRoute'));
app.use(apiPrefix, require('./_routers/userRoute'));
app.use(apiPrefix, require('./_routers/rolesRoute'));
app.use(apiPrefix, require('./_routers/manufactureRoute'));
app.use(apiPrefix, require('./_routers/systemIntegratorRoute'));
app.use(apiPrefix, require('./_routers/plazaRoute'));
app.use(apiPrefix, require('./_routers/vehicleClassRoute'));
app.use(apiPrefix, require('./_routers/tollFareRoute'));
app.use(apiPrefix, require('./_routers/laneRoute'));
app.use(apiPrefix, require('./_routers/transactionTypeRoute'));
app.use(apiPrefix, require('./_routers/paymentTypeRoute'));
app.use(apiPrefix, require('./_routers/exemptTypeRoute'));
app.use(apiPrefix, require('./_routers/equipmentRoute'));
app.use(apiPrefix, require('./_routers/floatProcessRoute'));
app.use(apiPrefix, require('./_routers/shiftRoute'));
app.use(apiPrefix, require('./_routers/transactionRoute'));
app.use(apiPrefix, require('./_routers/fasTagProcessRoute'));
app.use(laneApiPrefix, require('./_routers/laneTransactionRoute'));
app.get("/", (request, response) => {
    const status = {
       "Status": "Running"
    };
    
    response.send(status);
 });
let port = process.env.PORT || 5001; 
app.listen(port, () => console.log('Server listening on port ' + port));