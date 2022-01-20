// import App from 'next/app'
import React, { useEffect, useLayoutEffect } from 'react';
// import fetchIntercept from 'fetch-intercept';


function MyApp({ Component, pageProps }) {

    // useEffect(() => {

    //     const unregister = fetchIntercept.register({
    //         request: function (url, config) {


             


    //             let newConfig = { ...config}
    //             if (url.includes('_next/data') && url.includes('hello')) {
    //                 //let controller = new AbortController();
    //                // setTimeout(() => controller.abort(), 2000);

                     
    //                  newConfig = { ...newConfig }
    //                 console.log('>>> ', url)
    //             }
    //             // Modify the url or config here
    //             return [url, newConfig]
    //         },

    //         requestError: function (error) {
    //             // Called when an error occured during another 'request' interceptor call
    //           //  return Promise.reject(error);
    //         },

    //         response: function (response) {
    //             // Modify the reponse object
    //             return response;
    //         },

    //         responseError: function (error) {
    //             // Handle an fetch error

    //             console.log(error)

            
    //             return Promise.reject(error);
    //         }
    //     });

    // }, []); // N’exécute l’effet que si count a changé

    return <Component {...pageProps} />
}

// Only uncomment this method if you have blocking data requirements for
// every single page in your application. This disables the ability to
// perform automatic static optimization, causing every page in your app to
// be server-side rendered.
//
// MyApp.getInitialProps = async (appContext) => {
//   // calls page's `getInitialProps` and fills `appProps.pageProps`
//   const appProps = await App.getInitialProps(appContext);
//
//   return { ...appProps }
// }

export default MyApp