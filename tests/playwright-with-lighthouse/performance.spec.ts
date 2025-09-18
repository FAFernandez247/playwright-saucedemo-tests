import { test } from '@playwright/test';
import { runLighthouseWithCustomConfig } from '../../shared/lighthouse-helper';
import fs from 'fs';

test('Custom Lighthouse audit from config', async ({}, testInfo) => {
  const url = 'https://www.saucedemo.com/';
  const result = await runLighthouseWithCustomConfig(url);


  const reportPath = 'lighthouse-report/custom-lighthouse-report.html';
  if (fs.existsSync(reportPath)) {
    const reportContent = fs.readFileSync(reportPath);
    await testInfo.attach('Lighthouse Report', {
      body: reportContent,
      contentType: 'text/html',
    });
  }

  if (result?.categories) {
    const summary = Object.entries(result.categories)
      .map(([cat, val]) => `${cat}: ${val.score}`)
      .join('\n');
    await testInfo.attach('Lighthouse Score Summary', {
      body: Buffer.from(summary),
      contentType: 'text/plain',
    });
  }
});