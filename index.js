const secret = require('./secret.json');

let webdriver = require('selenium-webdriver'),
  By = webdriver.By,
  until = webdriver.until;

let chromeCapabilities = webdriver.Capabilities.chrome();
//setting chrome options to start the browser with notifications disabled
let chromeOptions = {
  'args': ['--disable-notifications']
};

chromeCapabilities.set('chromeOptions', chromeOptions);
let driver = new webdriver.Builder().withCapabilities(chromeCapabilities).build();

async function moveToNextCard(profile) {
  try {
    await driver.actions().sendKeys(webdriver.Key.ARROW_DOWN).perform();
    // set swiping direction (currently set to swipe right)
    await driver.actions().sendKeys(webdriver.Key.ARROW_RIGHT).perform();
    try {
      const match = await drive.findElement(By.className('itsAMatch')).getText()
      console.log(match)
      if (match.length() > 0) {
        profile.profile.match = true
        console.log('Matched')
      } else {
      }
    } catch{
      profile.profile.match = false
    }
    await driver.actions().sendKeys(webdriver.Key.ESCAPE).perform();
    await setTimeout(() => { }, 500)
  } catch (err) {
    console.log(err);
  }
}

async function swipeCards(numberOfCards) {
  for (let i = 0; i < numberOfCards; i++) {
    await driver.wait(until.elementLocated(By.xpath('//*[@id="content"]/span/div/div[1]/div/main/div[1]/div/div/div[1]/div/div[1]/div[3]/div[1]/div[1]/div/div[1]/div/div')), 120000);
    await driver.actions().sendKeys(webdriver.Key.ARROW_UP).perform();
    await driver.wait(until.elementLocated(By.className('profileCard__card')))
    var profileHeader = await driver.findElement(By.className('profileCard__header')).getText()
    profileHeader = profileHeader.split('\n')
    const profile = {
      'name': profileHeader[0],
      'age': profileHeader[1],
      'Education': profileHeader[2],
      'profile': {
      }
    }
    try {
      const bio = await driver.findElement(By.xpath('//*[@id="content"]/span/div/div[1]/div/div/main/div/div/div[1]/div/div[2]/div[2]/div')).getText()
      profile.profile.bio = bio
    } catch{
      console.log(`No bio found`)
    } try {
      const anthem = await driver.findElement(By.xpath('//*[@id="content"]/span/div/div[1]/div/main/div[1]/div/div/div[1]/div[1]/div/div[2]/div[3]/div/div[1]')).getText()
      profile.profile.anthem = anthem
    } catch{
      console.log('No anthem found')
    }

    await console.log(profile)
    await moveToNextCard(profile);
  }
}

async function scrape() {
  try {
    await driver.get('http://www.facebook.com/');
    await driver.findElement(By.name('email')).sendKeys(secret.email);
    await driver.findElement(By.name('pass')).sendKeys(secret.password);
    await driver.findElement(By.id('loginbutton')).click();
    await driver.get('https://tinder.com/?lang=en');
    await driver.wait(until.elementLocated(By.xpath('//*[@id="modal-manager"]/div/div/div[2]/div/div[3]/div[2]/button')), 120000);
    await driver.findElement(By.xpath('//*[@id="modal-manager"]/div/div/div[2]/div/div[3]/div[2]/button')).click();
    await swipeCards(5);
    driver.quit();
  } catch (err) {
    console.log('error running scraper: ', err);
  }
}



scrape();
