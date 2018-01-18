// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyCJCkj1w2TAkvkdcZ0a3t-m7VI9YcF6wvY",
    authDomain: "pictionary-generator.firebaseapp.com",
    databaseURL: "https://pictionary-generator.firebaseio.com",
    projectId: "pictionary-generator",
    storageBucket: "",
    messagingSenderId: "255186121875"
  }
};
