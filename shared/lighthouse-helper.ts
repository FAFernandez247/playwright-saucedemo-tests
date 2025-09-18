import lighthouse from 'lighthouse';
import { launch } from 'chrome-launcher';
import * as fs from 'fs';
import * as yaml from 'js-yaml';

type LighthouseConfig = {
  output: 'html' | 'json' | 'csv';
  onlyCategories: string[];
  logLevel: 'info' | 'silent' | 'error' | 'warn';
  thresholds?: Record<string, number>;
  reportPath?: string;
};

function loadConfig(configPath: string): LighthouseConfig {
  const ext = configPath.split('.').pop();
  const fileContent = fs.readFileSync(configPath, 'utf8');

  if (ext === 'json') {
    return JSON.parse(fileContent);
  } else if (ext === 'yml' || ext === 'yaml') {
    return yaml.load(fileContent) as LighthouseConfig;
  }

  throw new Error(`Unsupported config file: ${configPath}`);
}

export async function runLighthouseWithCustomConfig(
  url: string,
  configPath = 'lighthouse.config.yml'
) {
  const userConfig = loadConfig(configPath);
  const chrome = await launch({ 
    chromePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    chromeFlags: ['--headless'] });

  const options = {
    output: userConfig.output,
    onlyCategories: userConfig.onlyCategories,
    logLevel: userConfig.logLevel,
    port: chrome.port,
  };

  const result = await lighthouse(url, options);

  const reportPath = userConfig.reportPath || 'lighthouse-report.html';
  if (result?.report) {
    const reportContent = Array.isArray(result.report) ? result.report.join('') : result.report;
    fs.writeFileSync(reportPath, reportContent);
    console.log(`✅ Lighthouse report saved to ${reportPath}`);
  }

  chrome.kill();

  // Evaluate thresholds if provided
  if (userConfig.thresholds && result) {
    for (const category in userConfig.thresholds) {
      const score = result.lhr.categories[category]?.score ?? 0;
      const expected = userConfig.thresholds[category];
      if (score < expected) {
        console.warn(`❌ ${category} score (${score}) is below threshold (${expected})`);
      } else {
        console.log(`✅ ${category} score (${score}) passed threshold (${expected})`);
      }
    }
  }

  return result ? result.lhr : undefined;
}