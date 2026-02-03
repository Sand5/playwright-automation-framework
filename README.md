# Playwright Automation Framework

A robust, maintainable, and scalable UI automation framework built with Playwright, TypeScript, and Cucumber.Designed to simplify end-to-end testing, it supports BDD-style tests, reusable step definitions, and flexible environment configurations.Whether you’re running full regression suites, targeted smoke tests, or individual feature files, this framework provides an easy-to-use structure for consistent and reliable test automation.

# Installation

Install required dependencies:

## Initialize Playwright
npm init playwright@latest
ß
## Compile TypeScript files
npm install --save-dev ts-node

## Install Cucumber
npm install --save-dev @cucumber/cucumber

## Cleanup tool for reports folder
npm install --save-dev rimraf

## Fake data generation
npm install --save-dev @faker-js/faker

## Environment variable loader
npm install dotenv

## Logging
npm install --save-dev winston
npm install --save-dev @colors/colors


# Project Setup

Clone the repository

git clone https://github.com/Sand5/playwright-automation-framework
cd playwright-automation-framework

Ensure you have a .env file at the root for environment configuration, including browser preferences, test environments, etc.

# Running Tests

## Using Playwright

Run all tests in headed mode:
npx playwright test --headed

Run tests in headless mode:
npx playwright test


## Using Cucumber

Run all feature files:
UI_AUTOMATION_BROWSER=chromium HEADLESS=false TEST_ENV=qa npm run cucumber
OR
npx cucumber-js src/features/*.feature \
  --require-module ts-node/register \
  --require "src/step-definitions/**/**/*.ts" \
  --require src/utils/cucumber-timeout.ts

Run a specific feature using a custom script with a tag:
UI_AUTOMATION_BROWSER=chromium HEADLESS=false TEST_ENV=qa npm run cucumber login

Use TEST_CRED from terminal
UI_AUTOMATION_BROWSER=chromium HEADLESS=false TEST_ENV=qa TEST_CRED='{"username":"webdriver","password":"12345"}' npm run cucumber login

Or leave TEST_CRED blank → fallback to localsecrets.env
UI_AUTOMATION_BROWSER=chromium HEADLESS=false TEST_ENV=qa TEST_CRED= npm run cucumber login

Or skip TEST_CRED entirely → also fallback to localsecrets.env
UI_AUTOMATION_BROWSER=chromium HEADLESS=false TEST_ENV=qa npm run cucumber login


Run tests for specific tags via index.ts:
ts-node ./src/index.ts smoke
This executes all scenarios marked with the @smoke tag.

Run the regression suite using npm script:
npm run cucumber regression

The cucumber script in package.json contains:
"npx cucumber-js ts-node ./src/index.ts"

# Docker

 ## .dockerignore
 node_modules
.env
env/*.env
reports
test-results
.git
.gitignore
README.md

## Dockerfile
Use official Playwright image with Node.js and browsers pre-installed
FROM mcr.microsoft.com/playwright:v1.58.0-jammy

Set working directory
WORKDIR /app

Copy package files
COPY package*.json ./

Install dependencies
RUN npm install

Copy the rest of the project
COPY . .

Default command to run tests
CMD ["npm", "run", "cucumber", "login"]

# Docker Usage

### Dockerfile only (no Compose)
Build the image and run the container:

docker build -t playwright-framework .
docker run --rm --env-file env/localsecrets.env playwright-framework

 Run tests with environment variables:
 docker run --rm --env-file env/localsecrets.env playwright-framework

 Override the default command if needed:
 docker run --rm --env-file env/localsecrets.env playwright-framework npm run cucumber regression

### Docker Compose + Dockerfile
 docker compose up

-Compose builds the image automatically from the Dockerfile and runs the container(s).
-No separate docker build needed.

### Docker Compose + existing image
docker compose up

-Compose uses existing local images or pulls them from a registry.
-No Dockerfile, no build step, no docker build needed.

### Docker Compose + images not present locally
docker compose up

Compose checks for the image locally.
If missing → pulls from the registry.
Creates networks/volumes as defined, then runs containers.
 Key points:
         No Dockerfile → nothing to build
         No build: section → Compose does not attempt a build

### Docker Compose + no build / no Dockerfile / no local image
docker compose up

Compose checks for the image specified under image: locally.
If the image is not found locally, Compose automatically pulls it from a registry (e.g., Docker Hub).
Creates networks and volumes as defined, then runs the container.
 Key points:
   No Dockerfile → nothing to build
   No build: → Compose does not attempt any build
   No local image → Compose pulls it automatically

### Docker Override a single variable (e.g. HEADLESS)
docker compose run -e HEADLESS=false playwright npm run cucumber login

### Docker Override multiple variables
docker compose run \
  -e HEADLESS=false \
  -e UI_AUTOMATION_BROWSER=firefox \
  playwright npm run cucumber login

### Docker Environment Variable Precedence
When the same environment variable is defined in multiple places, Docker Compose resolves them in the following order (lowest → highest):

1 - docker-compose.yml → environment:

2 -env/localsecrets.env → shared defaults & secrets

3 -Environment-specific file loaded by the framework

loadEnv({ path: `./env/.env.${TEST_ENV}` });

TEST_ENV=qa → env/.env.qa
TEST_ENV=dev → env/.env.dev
Command-line overrides (-e VAR=value)
Command-line variables always win.


# Configuration

.env — Contains environment variables, browser settings, and test environments.
profiles object in the index.ts — Holds tag configurations for running specific scenarios.

## Step Definitions & World
CucumberWorld Class: Extends World from Cucumber to share objects and data between steps.
Step definitions are located in src/step-definitions/

## VS Code Cucumber Setup

To enable IntelliSense and step syncing:
-Press Ctrl + Shift + P (Windows/Linux) or Cmd + Shift + P (Mac).
-Open Preferences: Open Settings (JSON).
-Ensure the following entries exist:

"cucumberautocomplete.steps": [
  "src/step-definitions/*.ts"
],
"cucumberautocomplete.syncfeatures": "src/features/**/*.feature"

## TypeScript / Playwright Lint

Scripts in package.json:
"lint": "eslint . --ext .ts",
"lint:fix": "eslint . --ext .ts --fix"

lint: Checks all .ts files for linting errors.
lint:fix: Automatically fixes linting issues where possible.

Required files / configuration:
eslint.config.cjs — your ESLint configuration file

Make sure ESLint is installed locally:
npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin

This ensures ESLint understands TypeScript syntax and your project rules.

## Gherkin / Feature File Lint

Script in package.json:
"lint:gherkin": "gherkin-lint -c gerkin-lint.json 'src/features/*.feature'"

lint:gherkin: Runs Gherkin linting on all feature files in src/features/
Uses the configuration file gerkin-lint.json
Based on the Cucumber Full Support VS Code plugin, ensuring your .feature files follow the same indentation, step formatting, and other conventions.

Required files / configuration:
.gherkin-lintrc (or your custom gerkin-lint.json)

Install Gherkin Lint globally or locally:
npm install --save-dev gherkin-lint

The configuration aligns with Cucumber Full Support formatting:

-Steps (Given, When, Then, And) indentation
-Examples / tables indentation
-File naming (kebab-case or PascalCase)
-Scenario and step length rules
-EOF newlines and no trailing spaces



# Project Structure: playwright-automation-framework

```text
.
├── .github
│   └── workflows
│       └── ci.yml                   # GitHub Actions CI workflow
├── .vscode
│   └── settings.json                # VS Code project settings
├── env                               # Environment configurations
│   ├── .env.dev                      # Dev environment variables
│   ├── .env.qa                       # QA environment variables
│   └── localsecrets.env              # Default secrets (USERNAME, PASSWORD)
├── reports                           # Generated test reports
│   ├── cucumber_report.html          # HTML report
│   └── cucumber_report.json          # JSON report
├── src                               # Source code
│   ├── features                      # Cucumber feature files (BDD scenarios)
│   │   ├── contact-us.feature
│   │   └── login.feature
│   ├── logger                         # Logging utilities
│   │   └── logger.ts
│   ├── page-objects                   # Page Object Model files
│   │   ├── base                       # Base page classes
│   │   ├── contact-us.page.ts
│   │   ├── home.page.ts
│   │   └── login.page.ts
│   ├── step-definitions               # Step definitions for Cucumber
│   │   ├── hooks                      # Before/after scenario hooks
│   │   ├── world                      # Cucumber World extensions
│   │   ├── base.steps.ts
│   │   ├── contact-us.steps.ts
│   │   ├── home.steps.ts
│   │   └── login.steps.ts
│   ├── utils                          # Utility scripts
│   │   ├── cucumber-timeout.ts       # Timeout helpers for Cucumber
│   │   ├── data.resolver.ts           # Test data generation (faker/defaults)
│   │   ├── playwright-timeouts.ts     # Browser-specific timeouts
│   │   ├── take-screenshot.ts         # Screenshots on test failures
│   │   └── testdata-config.ts         # Config for test data
│   └── index.ts                        # Entry point / custom runner
├── tests                              # Standalone Playwright tests
│   └── example.spec.ts
├── .dockerignore                       # Files/folders ignored during Docker build
├── .gherkin-lintrc                     # Gherkin linter configuration
├── .gitignore                          # Git ignore file
├── .prettierrc                          # Prettier configuration
├── Dockerfile                          # Docker setup for Playwright framework
├── README.md                           # Project documentation
├── docker-compose.yml                  # Docker Compose configuration
├── eslint.config.cjs                   # ESLint configuration
├── package-lock.json                    # NPM lock file
├── package.json                         # NPM scripts & dependencies
├── playwright.config.ts                 # Playwright configuration
└── tsconfig.json                        # TypeScript configuration


Feature Execution Flow 


Feature Files (.feature)
       │
       ▼
Step Definitions (.ts)
       │
       ▼
Cucumber World
       │
       ▼
Utilities & Helpers
       │
       ▼
Playwright Browser Actions


This shows how features are executed step-by-step through the framework.

Dependencies

Playwright: Browser automation
Cucumber: BDD framework
ts-node: TypeScript runtime
rimraf: Cleanup utility
faker: Fake data generation
dotenv: Environment variable loader
winston & colors: Logging