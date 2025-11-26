# Playwright Automation Framework

A robust, maintainable, and scalable UI automation framework built with Playwright, TypeScript, and Cucumber.Designed to simplify end-to-end testing, it supports BDD-style tests, reusable step definitions, and flexible environment configurations.Whether you’re running full regression suites, targeted smoke tests, or individual feature files, this framework provides an easy-to-use structure for consistent and reliable test automation.

# Installation

Install required dependencies:

# Initialize Playwright
npm init playwright@latest

# Compile TypeScript files
npm install --save-dev ts-node

# Install Cucumber
npm install --save-dev @cucumber/cucumber

# Cleanup tool for reports folder
npm install --save-dev rimraf

# Fake data generation
npm install --save-dev @faker-js/faker

# Environment variable loader
npm install dotenv

# Logging
npm install --save-dev winston
npm install --save-dev @colors/colors


# Project Setup

Clone the repository

git clone https://github.com/Sand5/playwright-automation-framework
cd playwright-automation-framework

Ensure you have a .env file at the root for environment configuration, including browser preferences, test environments, etc.

# Running Tests

Using Playwright

Run all tests in headed mode:
npx playwright test --headed

Run tests in headless mode:
npx playwright test


Using Cucumber

Run all feature files:
UI_AUTOMATION_BROWSER=chromium HEADLESS=false TEST_ENV=qa npm run cucumber
OR
npx cucumber-js src/features/*.feature \
  --require-module ts-node/register \
  --require "src/step-definitions/**/**/*.ts" \
  --require src/utils/cucumber-timeout.ts

Run a specific feature using a custom script with a tag:
UI_AUTOMATION_BROWSER=chromium HEADLESS=false TEST_ENV=qa npm run cucumber login

Run tests for specific tags via index.ts:
ts-node ./src/index.ts smoke
This executes all scenarios marked with the @smoke tag.

Run the regression suite using npm script:
npm run cucumber regression

The cucumber script in package.json contains:
"npx cucumber-js ts-node ./src/index.ts"

# Configuration

.env — Contains environment variables, browser settings, and test environments.
profiles object in the index.ts — Holds tag configurations for running specific scenarios.

Step Definitions & World
CucumberWorld Class: Extends World from Cucumber to share objects and data between steps.
Step definitions are located in src/step-definitions/

VS Code Cucumber Setup

To enable IntelliSense and step syncing:
-Press Ctrl + Shift + P (Windows/Linux) or Cmd + Shift + P (Mac).
-Open Preferences: Open Settings (JSON).
-Ensure the following entries exist:

"cucumberautocomplete.steps": [
  "src/step-definitions/*.ts"
],
"cucumberautocomplete.syncfeatures": "src/features/**/*.feature"

TypeScript / Playwright Lint

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

Gherkin / Feature File Lint

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

# Project Structure

Folder Hierarchy
playwright-automation-framework/
├── README.md # Project documentation
├── env # Environment configurations
├── eslint.config.cjs # ESLint configuration
├── package-lock.json # NPM lock file
├── package.json # NPM scripts & dependencies
├── playwright.config.ts # Playwright configuration
├── reports/ # Test reports
├── test-results/ # Raw test result files
├── tsconfig.json # TypeScript configuration
│
├── src/ # Source code
│ ├── features/ # Cucumber feature files
│ │ ├── contact-us.feature
│ │ └── login.feature
│ │
│ ├── step-definitions/ # Step definitions
│ │ ├── base.steps.ts
│ │ ├── contact-us.steps.ts
│ │ ├── home.steps.ts
│ │ ├── login.steps.ts
│ │ ├── hooks/ # Hook scripts (before/after scenarios)
│ │ └── world/ # Cucumber World extensions
│ │
│ ├── page-objects/ # Page Object Model files
│ │ ├── base/ # Base page classes
│ │ ├── contact-us.page.ts
│ │ ├── home.page.ts
│ │ └── login.page.ts
│ │
│ ├── utils/ # Utility scripts
│ │ ├── cucumber-timeout.ts
│ │ ├── playwright-timeouts.ts
│ │ └── take-screenshot.ts
│ │
│ ├── logger/ # Logging utilities
│ │ └── logger.ts
│ │
│ └── index.ts # Entry point or custom runner
│
└── tests/ # Standalone test files
└── example.spec.ts


---

### Feature Execution Flow (Markdown-ready)

```text
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