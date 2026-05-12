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

    // 1. Navigate page
    await test.open(page);

    // 2. Run Axe scan
    const results = await runAxe(page);

    // 3. Generate HTML report
    generateA11yHtmlReport(test.name, results);

    const violations = results.violations;

    const isCI = process.env.CI === 'true';

    if (isCI) {
      // ---------------------------------------------
      // CI MODE → strict enforcement (currently disabled)
      // ---------------------------------------------
      const criticalViolations = violations.filter(
        (v) => v.impact === 'critical' || v.impact === 'serious',
      );

      if (criticalViolations.length > 0) {
        console.error(`A11Y FAILED (CI): ${test.name}`);
        console.log(JSON.stringify(criticalViolations, null, 2));

        // FAIL CI PIPELINE (COMMENTED OUT)
        // process.exitCode = 1;
      } else {
        console.log(`A11Y PASSED (CI): ${test.name}`);
      }
    } else {
      // ---------------------------------------------
      // LOCAL MODE → warnings only (currently disabled fail)
      // ---------------------------------------------
      if (violations.length > 0) {
        console.warn(`A11Y warnings (LOCAL): ${test.name}`);
        console.log(JSON.stringify(violations, null, 2));
        
        process.exitCode = 1; // Set exit code to indicate failure, but do not exit immediately to allow report generation
        // FAIL LOCAL RUN
        if (process.exitCode === 1) {
          console.log('\nA11Y PIPELINE FAILED\n');
        } else {
          console.log('\nA11Y PIPELINE PASSED\n');
        }
      } else {
        console.log(`${test.name} passed WCAG AA`);
      }
    }
  } catch (error) {
    console.error(`Error running A11y test: ${test.name}`);
    console.error(error);

    process.exitCode = 1;
  } finally {
    await browser.close();
  }
}
