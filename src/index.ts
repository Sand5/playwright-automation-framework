import { exec } from 'child_process';
import dotenv from "dotenv";
dotenv.config({ path: "./env/.env" });

//Setting retry value from env variables or default to '0' OR '1'
const parallelValue = process.env.PARALLEL_TESTS || '2';
const retryValue = process.env.RETRY || '0';

//Define a common command string for running cucumber tests
export const testCommand = `./src/features/*.feature \
--require-module ts-node/register \
--require ./src/step-definitions/**/**/*.ts \
--require ./src/utils/cucumber-timeout.ts \
-f json:./reports/report.json \
--format html:./reports/report.html \
--parallel ${parallelValue} \
--retry ${retryValue} \
--tags "not @ignore"`;

//Define an infterface for the profiles
//It defines an interface where each key is a string and the value is also a string

interface ProfileCommands {
  [key: string]: string;
}

//Define a command strrings fo different test profiles
const profiles: ProfileCommands = {
  smoke: `${testCommand} --tags "@smoke"`,
  regression: `${testCommand} --tags "@regression"`,
  login: `${testCommand} --tags "@login"`,
  contactUs: `${testCommand} --tags "@contact-us"`,
};

//Get the third commmand line argument and assign it the profile variable
//i.e smoke, regression, login etc
const profile = process.argv[2];

// ✅ Check for valid profile
if (!profiles[profile as keyof typeof profiles]) {
  console.error(`\nInvalid profile: "${profile}"`);
  console.log(`Available profiles: ${Object.keys(profiles).join(', ')}`);
  process.exit(1);
}

//Construst the command string based on the profile selected
//Command is the full command to run the tests fore the selected profile
//let command = `npx cucumber-js ${profiles[profile as 'smoke'|'regression'|'login'|'contact-us']}`; 
const command = `npx cucumber-js ${profiles[profile as keyof typeof profiles]}`;
console.log(`Running tests with command: ${command}\n`);

exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error(`\nTest execution failed with error:\n${error.message}`);
    if (stdout) {
      console.log(`\nStandard Output:\n${stdout}`);
    }
    if (stderr) {
      console.error(`\nStandard Error:\n${stderr}`);
    }
    process.exit(error.code ?? 1);
  } else {
    if (stderr) {
      console.error(`\nstderr:\n${stderr}`);
    }
    console.log(`\nstdout:\n${stdout}`);
  }
});