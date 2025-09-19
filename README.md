<div align="center">

# . ݁₊ ⊹ . ݁ ⟡ ݁ . ⊹ ₊ ݁.
# ⊹ ࣪ ˖ 🎭Playwright Test Automation – SauceDemo ˖ ࣪ ⊹


### A Playwright automation framework showcasing **POM, fixtures, storage state, data-driven testing, session handling, and CI/CD**.
![CI](https://github.com/FAFernandez247/playwright-saucedemo-tests/actions/workflows/playwright.yml/badge.svg)
![Playwright](https://img.shields.io/badge/Tested%20with-Playwright-blue)
---
</div>

## 📌 Project Overview
This project automates functional testing of the [SauceDemo](https://www.saucedemo.com/) e-commerce site using **Playwright**. It demonstrates real-world test automation practices for building a scalable test framework.

## ✨ Features
- ✅ **Page Object Model (POM)** for clean, reusable code  
- ✅ **Fixtures** for injecting Page Object Models (no repeated imports)  
- ✅ **Session Handling** (back button behavior)  
- ✅ **Data-Driven Tests** (loop through multiple user accounts)  
- 📸 **Failure Screenshots** (auto-attached to Playwright reports for debugging)  
- ✅ **Performance Testing (Lighthouse)** – run locally  
- ✅ **CI/CD Integration** with GitHub Actions

## 💡Quick Start Guide
***Please do this after forking and cloning the Repository:***

#### 📜Installation of Playwright & Other Dependencies

```bash
npm install
```

**⚡ Setup for Cart Tests**

***The Cart and Checkout test suites depend on an authenticated user***
***We handle this with a dedicated auth.setup.ts file that:***
- Logs in the user
- Stores a storage state (.auth/user.json) so cart tests can skip login

#### ▶ Run Setup (Login once)
```bash
npx playwright test tests/auth.setup.ts --project setup
```
***Or***
```bash
npm run auth-setup
```

#### ▶ Run tests 
```bash
# Run all tests
npx playwright test

# Run specific test file
npx playwright test tests/login.spec.ts --project chromium
npx playwright test tests/cart.spec.ts --project cart
```
***⚠️Note: Running cart.spec.ts will fail if you haven't run auth.setup.ts first because the .auth/ folder and user.json storage state file are created only after setup.***
