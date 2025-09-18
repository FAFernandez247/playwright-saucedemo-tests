import { Page, TestInfo } from '@playwright/test';
import { takeScreenshot, readLatestScreenshot } from './utils';
import { existsSync, mkdirSync } from 'fs';
import * as path from 'path';


const SCREENSHOT_DIR = 'test-screenshots';

/**
 * Attaches a screenshot to the Playwright test report.
 * @param page - The Playwright Page object.
 * @param testInfo - The Playwright TestInfo object.
 * @param screenshotName - The name to be used for the screenshot attachment.
 */
export async function attachScreenshot(page: Page, testInfo: TestInfo, screenshotName: string): Promise<void> {
  const testCaseName = testInfo.title; // Use the test case name from TestInfo
  await takeScreenshot(page, testCaseName, SCREENSHOT_DIR);
  const screenshotBuffer = readLatestScreenshot(SCREENSHOT_DIR, testCaseName);
  await testInfo.attach(screenshotName, {
    body: screenshotBuffer,
    contentType: 'image/png',
  });
}

/**
 * Ensures the directory and file exist securely.
 * @param directoryPath - The directory where the file is located.
 * @param fileName - The name of the file to check.
 * @returns The full path to the file.
 * @throws Error if the file does not exist or if path traversal is detected.
 */
export function ensureFileExists(directoryPath: string, fileName: string): string {
  // Resolve the base directory to an absolute path
  const baseDirectory = path.resolve(directoryPath);

  const sanitizedFileName = fileName.replace(/(\.\.[\/\\])/g, ''); // Remove directory traversal patterns
  const filePath = path.join(baseDirectory, sanitizedFileName);

  // Ensure the resolved path is within the base directory
  if (!filePath.startsWith(baseDirectory)) {
    throw new Error('Path traversal detected');
  }

  // Ensure the directory exists
  if (!existsSync(baseDirectory)) {
    mkdirSync(baseDirectory, { recursive: true });
    console.log(`Directory created: ${baseDirectory}`);
  }

  // Ensure the file exists
  if (!existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  return filePath;
}