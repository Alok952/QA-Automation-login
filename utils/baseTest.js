// baseTest.js using ES Modules
import { Builder } from "selenium-webdriver";  // Use import statement

class BaseTest {
  constructor() {
      this.driver = new Builder().forBrowser("chrome").build(); // Initialize driver using imported Builder
  }

  async openUrl(url) {
      await this.driver.get(url);
  }

  async closeBrowser() {
      await this.driver.quit();
  }
}

export default BaseTest; // Default export using ES Module syntax
