require('rootpath')();
require("dotenv").config();
const express = require('express');
const app = express();
const cors = require('cors');

const errorHandler = require('_middleware/error-handler');
const auth = require("_middleware/auth");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/users', require('_routers/userRoute'));

// global error handler
app.use(errorHandler);

app.get("/", (request, response) => {
    const status = {
       "Status": "Running"
    };
    
    response.send(status);
 });
let port = process.env.PORT || 5001; 
app.listen(port, () => console.log('Server listening on port ' + port));