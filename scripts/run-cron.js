

const cron = require('node-cron');
const fs = require('fs');
const path = require('path')

require('dotenv').config()
require('dotenv').config({ override: true, path: path.join(__dirname, '../.env.local'), debug: true })

const mesure = require('./mesure');

if (process.env.CRON_EXPRESSION_MULTI) {

    let usersNumber = process.env.RUN_MULTI_USERS_NUMBER
    let interval = parseInt(60 / usersNumber);
    for (let i = 1; i <= usersNumber; i++) {

        let expression = ((i - 1) * interval) + ' ' + process.env.CRON_EXPRESSION_MULTI

        console.log(expression)
        cron.schedule(expression, function () {
            console.log('---------------------');
            console.log('Running Cron Job');

            try {
                console.log('>> run mesure  : ' + i)
                mesure(i)

            } catch (error) {
                console.log(error)
            }


        })
    }
}


if (process.env.CRON_EXPRESSION) {

        cron.schedule(process.env.CRON_EXPRESSION, function () {
            console.log('---------------------');
            console.log('Running Cron Job');
            try {
             
                mesure('')
            } catch (error) {
                console.log(error)
            }

        })
}




