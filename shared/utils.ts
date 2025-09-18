import { Page } from '@playwright/test';
import path from 'path';
import fs from 'fs';

/**
 * Takes a screenshot with a dynamic name based on the test case name and current date.
 * @param page - The Playwright Page object.
 * @param testCaseName - The name of the test case (usually `testInfo.title`).
 * @param screenshotDir - The directory where screenshots will be saved (default: 'test-screenshots').
 * @returns {Promise<Buffer>} - The screenshot as a Buffer.
 */
export async function takeScreenshot(page: Page, testCaseName: string, screenshotDir: string = 'test-screenshots'): Promise<Buffer> {
  // Generate a human-readable timestamp for the screenshot name
  const now = new Date();
  const timestamp = now.toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false, // Use 24-hour format
  }).replace(/[/,:]/g, '-').replace(/\s/g, '_'); // Replace invalid characters for filenames

  // Create a sanitized test case name for the filename
  const sanitizedTestCaseName = testCaseName.replace(/[^a-zA-Z0-9]/g, '_'); // Replace special characters with underscores

  // Generate the dynamic screenshot name
  const screenshotName = `${sanitizedTestCaseName}_${timestamp}.png`;

  // Ensure the screenshot directory exists
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true }); // Create directory if it doesn't exist
  }

  // Take the screenshot and save it to the specified directory
  const screenshotPath = path.join(screenshotDir, screenshotName);
  const screenshotBuffer = await page.screenshot({
    path: screenshotPath,
    fullPage: true,
  });

  return screenshotBuffer;
}

/**
 * Reads the latest screenshot file into a Buffer.
 * @param screenshotDir - The directory where screenshots are saved.
 * @param testCaseName - The name of the test case (used to filter relevant screenshots).
 * @returns {Buffer} - The screenshot file as a Buffer.
 * @throws {Error} - If no matching screenshots are found.
 */
export function readLatestScreenshot(screenshotDir: string, testCaseName: string): Buffer {
  const sanitizedTestCaseName = testCaseName.replace(/[^a-zA-Z0-9]/g, '_');

  // Read files safely
  const screenshotFiles = fs
    .readdirSync(screenshotDir)
    .filter((file) => file.startsWith(sanitizedTestCaseName))
    .sort((a, b) => fs.statSync(path.join(screenshotDir, b)).mtimeMs - fs.statSync(path.join(screenshotDir, a)).mtimeMs); // Sort by modification time

  if (screenshotFiles.length === 0) {
    console.warn(`No screenshots found for test case: ${testCaseName}`);
    return Buffer.alloc(0); // Return an empty buffer instead of throwing an error
  }

  const latestScreenshot = screenshotFiles[0]; // Pick the most recent one
  return fs.readFileSync(path.join(screenshotDir, latestScreenshot));
}

