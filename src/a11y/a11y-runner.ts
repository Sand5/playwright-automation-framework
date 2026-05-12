import { launchA11yBrowser } from './a11y-browser-factory';
import { runAxe } from './axe.runner';
import { generateA11yHtmlReport } from './a11y-reporter';
import { config } from '../config/env';

type A11yPageTest = {
  name: string;
  open: (page: any) => Promise<void>;
};

export async function runA11yTest(test: A11yPageTest) {
  const browser = await launchA11yBrowser(config.browser, config.headless);

  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    console.log(`\nRunning A11y scan: ${test.name}`);
    
    // 1. Navigate / prepare page (your Page Object logic)
    await test.open(page);

    // 2. Run Axe accessibility scan
    const results = await runAxe(page);

    // Generate HTML report
    generateA11yHtmlReport(test.name, results);

    // 3. Handle results
    if (results.violations.length > 0) {
      console.error(`Accessibility violations found in: ${test.name}`);

      console.log(JSON.stringify(results.violations, null, 2));

      // fail CI pipeline
      process.exitCode = 1;
    } else {
      console.log(`${test.name} passed WCAG AA`);
    }
  } catch (error) {
    console.error(`Error running A11y test: ${test.name}`);
    console.error(error);

    process.exitCode = 1;
  } finally {
    // ALWAYS clean up browser
    await browser.close();
  }
}
