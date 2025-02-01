// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  // production: false,
  production: true,
  PAYPAL_API: 'https://api-m.sandbox.paypal.com/v1/',
  // API_HOST: 'https://4edentalai.com/api/',
  // API_HOST: 'http://localhost:4000/api/',
  API_HOST: 'http://23.21.163.171:4000',
  
  FILE_HOST: 'http://localhost:4000/',
  LOCAL_HOST: 'http://localhost:4200/',
  GEO_LOCATION: 'http://ip-api.com/json',
  // ! paypal
  PAYPAL_CLIENT_ID: 'AYCBFqGe2Tco1l33ZXvZXbdPKfPJVyqa2-NjAta0ytO1zR406yq2O66FkBI2_IdvKiRaUOcMPbTM-Ys_',
  PAYPAL_CLIENT_SECRET_KEY: 'EB7iibKAc300PD34UVfZC_ESm6XWeJsCRK9GZq0ccemEGL4pmb4Py_PYyLuozAeJdkUVNQ1N-CmTroM6',
  PROD_ID: 'PROD-1PK24124KM619970U',
  // ! google recaptcha
  recaptcha: {
    siteKey: '6Ld7TU0mAAAAAFjH7axIGjhz4hCyTVTkAzGOtUfs'
  },
};



// AI_URL: 'http://67.202.33.254:5000/predict',
// AI_URL: 'https://c602-52-173-187-78.ngrok-free.app/predict',
/*
 * For easier debugging in development mode, you can import the following file
* to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
*
* This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
