import { Builder, By, until } from "selenium-webdriver";
import { expect } from "chai";
import config from "../config/config.js";
import locators from "../utils/locators.js";
import BaseTest from "../utils/baseTest.js";

describe("Login Tests", function () {
    this.timeout(30000); // Increase Mocha timeout to 30 seconds

    let baseTest;

    before(async function () {
        baseTest = new BaseTest();
    });

    after(async function () {
        await baseTest.closeBrowser();
    });

    it("should log in successfully with valid credentials and redirect to the dashboard", async function () {
        await baseTest.openUrl(config.BASE_URL);

        // Wait for username field to be visible
        await baseTest.driver.wait(until.elementLocated(By.id(locators.LOGIN_PAGE.USERNAME_FIELD)), 20000);

        // Enter valid credentials
        await baseTest.driver.findElement(By.id(locators.LOGIN_PAGE.USERNAME_FIELD)).sendKeys(config.USERNAME);
        await baseTest.driver.findElement(By.id(locators.LOGIN_PAGE.PASSWORD_FIELD)).sendKeys(config.PASSWORD);

        // Click login button using JavaScript to ensure it works
        let loginButton = await baseTest.driver.findElement(By.id(locators.LOGIN_PAGE.LOGIN_BUTTON));
        await baseTest.driver.executeScript("arguments[0].click();", loginButton);

        // Wait for URL to contain "dashboard" (Increase timeout to 30 seconds)
        await baseTest.driver.wait(until.urlContains("dashboard"), 30000);

        // Get current URL after login
        let currentUrl = await baseTest.driver.getCurrentUrl();
        console.log("Current URL after login:", currentUrl); // Debug the actual URL

        // Assert that URL contains 'dashboard'
        expect(currentUrl).to.include("dashboard");
    });

    it("should show an error for invalid login", async function () {
        await baseTest.openUrl(config.BASE_URL);

        // Enter invalid credentials
        await baseTest.driver.findElement(By.id(locators.LOGIN_PAGE.USERNAME_FIELD)).sendKeys(config.USERNAME);
        await baseTest.driver.findElement(By.id(locators.LOGIN_PAGE.PASSWORD_FIELD)).sendKeys(config.INVALID_PASSWORD);
        await baseTest.driver.findElement(By.id(locators.LOGIN_PAGE.LOGIN_BUTTON)).click();

        // Wait for error message to appear
        let errorElement = await baseTest.driver.wait(
            until.elementLocated(By.className(locators.LOGIN_PAGE.ERROR_MESSAGE)),
            20000
        );

        // Get error message text
        let errorMsg = await errorElement.getText();
        console.log("Actual Error Message:", errorMsg); // Debugging step

        // Assert that error message includes correct text
        expect(errorMsg).to.include("Username and password do not match");
    });
});
