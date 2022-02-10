

const fs = require('fs')
const path = require('path')
const axios = require('axios')
const algoliasearch = require("algoliasearch");

/// ------------------------ configs --------------------------------
const baseUrlApi = process.env.API_BASE_URL
const token = process.env.API_TOKEN
const contexts = process.env.ALGOLIA_CONTEXTS
const algoliaIndex = process.env.ALGOLIA_INEX
const maxPerExec = process.env.EXEC_MAX_PRODUCTS
const pauseInterval = process.env.EXEC_PAUSE_TIME
const algoliaAppId = process.env.ALGOLIA_APP_ID
const algoliaAPIKey = process.env.ALGOLIA_APP_KEY


const filePath = path.join(__dirname, '../public/logs/trace.csv')
const dirArchivePath = path.join(__dirname, '../public/logs/')

//const tmpFilePath = filePath + '_'

/// ------------------------------------------------------------------


const client = algoliasearch(algoliaAppId, algoliaAPIKey);
const index = client.initIndex(algoliaIndex);

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

const getFilePath = (instId) =>  path.join(__dirname, '../public/logs/trace.csv')
const getTmpFilePath = (instId) => filePath + '_' + instId    

axios.interceptors.request.use(function (config) {
    config.timeData = { startTime: new Date() }
    return config;
}, function (error) {
    return Promise.reject(error);
})

axios.interceptors.response.use(function (response) {
    response.config.timeData.endTime = new Date()
    return response;
}, function (error) {
    return Promise.reject(error);
});



const fiche = async ( prodId, instId) => {

    const config = {
        baseURL: baseUrlApi,
        headers: { Authorization: `Bearer ${token}` }
    }

    let URL1 = `/fiches/${prodId}/info` // Is Solde et VP 
    let URL2 = `/fiches/${prodId}/references`
    let URL3 = `/avis/${prodId}/produit`
    //let URL4 = `/rayons/11`

    const promise1 = axios.get(URL1, config);
    const promise2 = axios.get(URL2, config);
    const promise3 = axios.get(URL3, config);
    //const promise4 = axios.get(URL4, config);
    var start = new Date()

    return Promise.all([promise1, promise2, promise3]).then(function (values) {


        let duration1 = values[0].config.timeData.endTime - values[0].config.timeData.startTime
        let duration2 = values[1].config.timeData.endTime - values[1].config.timeData.startTime
        let duration3 = values[2].config.timeData.endTime - values[2].config.timeData.startTime
        //  let duration4 = values[3].config.timeData.endTime -values[3].config.timeData.startTime
        let duration = Math.max(duration1, duration2, duration3)

        let size1 = parseInt(values[0].headers['content-length'])
        let size2 = parseInt(values[1].headers['content-length'])
        let size3 = parseInt(values[2].headers['content-length'])

        //let size = Math.ceil((size1 + size2 + size3) / 1024, 2)

        //console.info(values[1].config.timeData)
        var end = new Date() - start
        //if (end > maxTime) maxTime = end

        let color = '\x1b[36m'
        if (duration > 250) color = "\x1b[43m"
        if (duration > 450) color = "\x1b[41m"
        console.log('%s Inst=%s Prod=%s Execution time: %dms, max=%dms ---> info=%dms, refs=%dms, avis=%dms \x1b[0m', color, instId, prodId, end, duration, duration1, duration2, duration3)
        // console.info('Prod=%s Size %dKb ---> info=%db, refs=%db, avis=%db', prodId, size, size1, size2,size3)
        let time = new Date().getTime()

        let instTmpFilePath = getTmpFilePath(instId)
        fs.appendFileSync(instTmpFilePath, `${time},${instId},${prodId},${end},${duration},${duration1},${duration2},${duration3}\r\n`)

    })

}



const  padTo2Digits = (num) => {
    return num.toString().padStart(2, '0');
  }

const  formatDate = (date) => {
    return (
      [
        date.getFullYear(),
        padTo2Digits(date.getMonth() + 1),
        padTo2Digits(date.getDate()),
      ].join('-') +
      ' ' +
      [
        padTo2Digits(date.getHours()),
        padTo2Digits(date.getMinutes()),
        padTo2Digits(date.getSeconds()),
      ].join('-')
    );
  }


const mesure = async (instId) => {

    //TODO get random context   
    let algoliaContexts = contexts.split('|')
    console.log(algoliaContexts)

    let allHits = []

    for (let i = 0; i < algoliaContexts.length; i++) {

        let { hits } = await index.search('', {
            hitsPerPage: 1000,
            ruleContexts: [algoliaContexts[i]]
        })

        allHits.push(...hits)

    }

    let allPrds = allHits.map(h => h.fiche.id)

    // Shuffle array
    const shuffled = allPrds.sort(() => 0.5 - Math.random());
    // Get sub-array of first n elements after shuffled
    let prds = shuffled.slice(0, maxPerExec);

    // var prds =  allPrds;  // require("random-array-subset")(allPrds,1000);


    console.log(' >>> ' + prds.length)

    //  console.log(prds)
    //let prodId = '25364' //'25997' /// '18080' // '221136'  '30698'// 
    //prds =  Array(100).fill(prodId)


    let startDateStr = formatDate(new Date())
    let instTmpFilePath = getTmpFilePath(instId)

    if (fs.existsSync(instTmpFilePath)) fs.unlinkSync(instTmpFilePath)
    fs.appendFileSync(instTmpFilePath, 'time,user,product,duration,max,fiche,refs,avis\r\n')

    for (let i = 0; i < prds.length; i++) {
        // console.log(i + ' / '+ prds.length)
        await fiche(prds[i], instId)
        await delay(pauseInterval)
    }

    let endDateStr = formatDate(new Date())

    let fileArchivePath = dirArchivePath+ 'archive/' +  startDateStr.replace(' ' ,'-' ) +'-'+  endDateStr.split(' ')[1] +'-trace'+instId+'.csv'


   // fs.renameSync(instTmpFilePath, filePath)
   
    fs.copyFileSync(instTmpFilePath, fileArchivePath)


}
module.exports = mesure; 
