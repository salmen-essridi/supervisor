## Install 
```sh
npm install 
```
## Config in .env
```sh
API_BASE_URL=""
API_TOKEN="" 
ALGOLIA_CONTEXTS=""
ALGOLIA_APP_KEY=""
ALGOLIA_APP_ID=""
ALGOLIA_INEX=""
EXEC_MAX_PRODUCTS=100
EXEC_PAUSE_TIME=1000
CRON_EXPRESSION='15 * * * *'
```

## Run mesure script
```sh
npm run mesure 
```

## Run cron 
```sh
//with config CRON_EXPRESSION='15 * * * *'
npm run cron 
```

## build dashboard 
```sh
npm run build 
```

## Run dashboard 
```sh
npm run start 
```