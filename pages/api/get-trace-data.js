

const csv = require('csvtojson')
import path from 'path'
import getConfig from 'next/config'
const fs = require('fs')
const { serverRuntimeConfig } = getConfig()

export default async (req, res) => {




  let targetPeriod = req.query.tp || ''



  const archivePath = path.join(serverRuntimeConfig.PROJECT_ROOT, './public/logs/archive/')


  let fileNames = fs.readdirSync(archivePath)


  fileNames.sort((a, b) => - a.localeCompare(b))

  let targetFileNames = (fileNames.length) ? [fileNames[0]] : []
  targetFileNames = (targetPeriod && fileNames.length) ? fileNames.filter(fileName => fileName.startsWith(targetPeriod)) : targetFileNames

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


