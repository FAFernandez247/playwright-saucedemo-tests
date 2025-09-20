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
- ✅ **Session Handling** (stay logged in across navigation, back button behavior)  
- ✅ **Data-Driven Tests** (loop through multiple user accounts)  
- 📸 **Failure Screenshots** (auto-attached to Playwright reports for debugging)  
- ✅ **Performance Testing (Lighthouse)** – run locally  
- ✅ **CI/CD Integration** with GitHub Actions

## ✅ Test Scenarios Covered

### 🔑 Login
- Should successfully login  
- Should fail with invalid credentials  
- Should fail with empty username/password  
- Should fail with locked-out user  
- Should not allow login with whitespace in username  
- Should allow login by pressing Enter key  
- Verify case sensitivity for username and password  

### 🛒 Cart & Checkout
- Should add items to cart and display correct products  
- Should remove items and update cart count
- Should show cart page as empty by default  
- Should complete checkout with valid details  
- Should correctly display order summary (products, total, tax)  

### 🔄 Session Handling
- Should stay logged in if the browser back button is clicked
- Should stay logged out if the browser back button is clicked
- Should stay on login page when accessing cart page directly

---


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
npx playwright test tests/data-driven-login.spec.ts --project chromium
npx playwright test tests/cart.spec.ts --project cart

# or
npm run login
npm run login-data-driven
npm run cart
```
***⚠️Note: Running cart.spec.ts will fail if you haven't run auth.setup.ts first because the .auth/ folder and user.json storage state file are created only after setup.***

#### ▶ Run with Playwright UI
```bash
# Run all tests
npx playwright test --ui

# Run specific test file
npx playwright test tests/login.spec.ts --project chromium --ui
npx playwright test tests/data-driven-login.spec.ts --project chromium --ui
npx playwright test tests/cart.spec.ts --project cart --ui

# or
npm run login-ui
npm run login-data-driven-ui
npm run cart-ui
```

**📊 Test Reporting**
- Default Playwright HTML report → run with:
```bash
npx playwright show-report
```
- Screenshots & traces attached automatically for failed runs

## ⚡ CI/CD (GitHub Actions)

- Functional tests (login, cart, login-data-driven) run on workflow dispatch.
- Performance test (lighthouse) is excluded from CI/CD

## 📊 Performance Testing (Lighthouse)
```bash
npx playwright test tests/playwright-with-lighthouse/performance.spec.ts --project chromium

# Or

npm run performance-test
```
- An HTML report is saved in lighthouse-report/

## 🛠️ Tech Stack
- [Playwright](https://playwright.dev/) 
- [TypeScript](https://www.typescriptlang.org/)
- [Faker.js](https://fakerjs.dev/) – test data generation
- [Lighthouse](https://github.com/GoogleChrome/lighthouse) – performance test  
- [GitHub Actions](https://github.com/features/actions) – CI/CD 
