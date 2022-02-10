

const cron = require('node-cron');
const path = require('path')
const fs = require('fs');

require('dotenv').config()
require('dotenv').config({ override: true, path:  path.join(__dirname, '../.env.local') , debug : true})

const mesure = require('./mesure');

try {
    mesure('')
} catch (error) {
    console.log(error)
}


