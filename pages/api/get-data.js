

const csv=require('csvtojson')
import path from 'path'
import getConfig from 'next/config'
const { serverRuntimeConfig } = getConfig()

export default async (req, res) => {


 const filePath =  path.join(serverRuntimeConfig.PROJECT_ROOT,'./public/logs/trace.csv') 

  console.log(filePath)
  const jsonData = await csv().fromFile(filePath);
  //const data = await getStream.array(fs.createReadStream(filePath).pipe(parseStream));
   // data.map(line => line.join(',')).join('\n');
  
  
  //console.log(jsonData)
  res.status(200).json(jsonData)
}


