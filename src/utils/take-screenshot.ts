import { Page } from "@playwright/test";

// Capture a screenshot and save it with a timestamped filename
export async function takeScreenshot(
  page: Page,
  scenarioName: string
): Promise<{ image: Buffer; path: string }> {
  // Create UK-formatted timestamp in London time
  const timeStamp = new Date()
    .toLocaleString("en-GB", { timeZone: "Europe/London", hour12: false })
    .replace(/[: ]/g, "-");

  // Sanitize the scenario name for filesystem safety
  const safeName = scenarioName.replace(/[^a-z0-9\-]/gi, "_");

  // Build the final screenshot path
  const path = `./reports/screenshots/${safeName}-${timeStamp}.png`;

  // Take the full-page PNG screenshot
  const image = await page.screenshot({
    path,
    type: "png",
    fullPage: true,
  });

  // Return both the image buffer and the file path
  return { image, path };
}
