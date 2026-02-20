const puppeteer = require('puppeteer');
(async () => {
  try {
    const browser = await puppeteer.launch({
      headless: "new",
      userDataDir: "C:\Users\Particular\.gemini	mp\chrome-test",
      args: ['--no-sandbox']
    });
    console.log("SUCCESS");
    await browser.close();
  } catch (e) {
    console.log("FAIL: " + e.message);
  }
})();