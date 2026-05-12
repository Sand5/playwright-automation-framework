import fs from 'fs';
import path from 'path';
import { createHtmlReport } from 'axe-html-reporter';

const REPORT_DIR = 'reports/accessibility/html';

export function generateA11yHtmlReport(
  testName: string,
  results: any
) {
  // Create report folder if missing
  if (!fs.existsSync(REPORT_DIR)) {
    fs.mkdirSync(REPORT_DIR, { recursive: true });
  }

  // Convert test name to safe filename
  const safeFileName = testName
    .toLowerCase()
    .replace(/\s+/g, '-');

function getFormattedDate() {
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date());
}

const formattedDate = getFormattedDate();

createHtmlReport({
  results,

  options: {
    projectKey: 'Playwright Accessibility Tests',

 customSummary: `
  <div style="font-family: Arial; padding: 10px; border-bottom: 1px solid #ddd;">

    <p><strong>Test Name:</strong> ${testName}</p>

    <p><strong>Environment:</strong> ${process.env.TEST_ENV}</p>

    <p><strong>Browser:</strong> ${process.env.UI_AUTOMATION_BROWSER}</p>

    <p><strong>Executed:</strong> ${formattedDate}</p>

  </div>
`,

    outputDir: REPORT_DIR,
    reportFileName: `${safeFileName}.html`,
  },
});
  const reportPath = path.join(
    REPORT_DIR,
    `${safeFileName}.html`
  );

  console.log(`📄 HTML accessibility report created: ${reportPath}`);
}