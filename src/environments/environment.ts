// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  // Initialize Firebase
  production: false,
  firebaseConfig: {
    apiKey: 'AIzaSyAUNrIARzXe6kcodBV8bM_cEcZ3hC1k0GM',
    authDomain: 'helpthem-60d1a.firebaseapp.com',
    databaseURL: 'https://helpthem-60d1a.firebaseio.com',
    projectId: 'helpthem-60d1a',
    storageBucket: 'gs://helpthem-60d1a.appspot.com/',
    messagingSenderId: '1033310700341'
  },
  urlbase:'https://node-wilsonmanzanosanz271555.codeanyapp.com/api/v1/users',
};
