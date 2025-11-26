To install playwright use npm init playwright@latest
To install ts node to compile ts files to js  npm install --save-dev ts node
To run npx playwright test --headed or npx playwright test 
To install cucumber  npm install --save-dev @cucumber/cucumber
To install ts node in order for your ts files to compile and run npm install --save-dev ts-node
To Install rimfaf -- npm install --save-dev rimraf allows for cleanup operations in hooks for the reports folder
To install faker npm install --save-dev @faker-js/faker
To install a dotenv to load environment varibales 
To install winston for logging npm install --save-dev winston
To install colors for logging npm install --save-dev @colors/colors
We have the .env file which is configurations for browser etc
Ww have the cucumberworld class which extends the world from the cucumber package to allow us to share objects and data between steps
To run the the feature file using the following command:npx cucumber-js src/features/*.feature --require-module ts-node/register --require "src/step-definitions/**/**/*.ts --require src/utils/cucumber-timeout.ts"
To run the feature file using scripts run the following custom script: UI_AUTOMATION_BROWSER=chromium HEADLESS=false TEST_ENV=qa  npm run cucumber login
To run custom tags via the index.ts file use  ts -node ./src/index.ts smoke it looks for the tags which are part of the profiles object.
Use the script cucumber in the package .json file and run npm run cucumber regression (script contains "npx cucumber-js && ts-node ./src/index.ts")
7.Press Ctrl + Shift + P (Windows/Linux) or Cmd + Shift + P (Mac) to open the Command Palette.
Type:
Preferences: Open Settings (JSON)

Ensure the following steps are present 
  "cucumberautocomplete.steps": [
    "src/step-definitions/*.ts"
  ],

// ✅ Include all feature files for syncing
"cucumberautocomplete.syncfeatures": "src/features/**/*.feature",
The above helps with locating the step defs 