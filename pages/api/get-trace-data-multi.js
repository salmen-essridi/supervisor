

const csv = require('csvtojson')
import path from 'path'
import getConfig from 'next/config'
const fs = require('fs')
const { serverRuntimeConfig } = getConfig()

export default async (req, res) => {



  let dt = new Date()
  let targetPeriod = req.query.tp || dt.toISOString().slice(0, 10) +'-' + dt.getHours().toLocaleString('en-US', { minimumIntegerDigits: 2,useGrouping: false})


  console.log(targetPeriod)



  const archivePath = path.join(serverRuntimeConfig.PROJECT_ROOT, './public/logs/archive/')


  let fileNames = fs.readdirSync(archivePath)


  fileNames.sort((a, b) => - a.localeCompare(b))

 

  let targetFileNames = (fileNames.length) ? [fileNames[0]] : []
  targetFileNames = (targetPeriod && fileNames.length) ? fileNames.filter(fileName => fileName.startsWith(targetPeriod) &&  !fileName.endsWith('trace.csv')) : targetFileNames


  console.log(targetFileNames)

  let jsonData = []

  for (let i = 0; i < targetFileNames.length; i++) {
    let fileJsonData = await csv().fromFile(archivePath + targetFileNames[i]);
    jsonData = [...jsonData, ...fileJsonData]
  }

  jsonData.sort(function (a, b) {
    return parseInt(a.time) - parseInt(b.time);
  });


  console.log(archivePath)

  res.status(200).json({ files: targetFileNames, data: jsonData })
}


