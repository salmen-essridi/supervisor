

const cron = require('node-cron');
const fs = require('fs');
const path = require('path')

require('dotenv').config()
require('dotenv').config({ override: true, path:  path.join(__dirname, '../.env.local') , debug : true})

const mesure = require('./mesure');



cron.schedule( process.env.CRON_EXPRESSION, function () {
    console.log('---------------------');
    console.log('Running Cron Job');

    try {
        mesure()
    } catch (error) {
        console.log(error)
    }
});




