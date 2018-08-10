const express = require('express');
const path = require('path');
const parser = require('body-parser');
const secret = require('./secret.json');
const promise = require('selenium-webdriver').promise;
const https = require('https');
const fs = require('fs');

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

async function moveToNextCard() {
  let closeProfile = await driver.actions().sendKeys(webdriver.Key.ARROW_DOWN).perform();
  // let swipeLeft = await driver.findElement(By.xpath('//*[@id="content"]/div/span/div/div[1]/div/main/div[1]/div/div/div[1]/div/div[2]/button[2]')).click();
  let swipeRight = await driver.findElement(By.xpath('//*[@id="content"]/div/span/div/div[1]/div/main/div[1]/div/div/div[1]/div/div[2]/button[4]')).click();
  let ensureCardExit = await driver.actions().sendKeys(webdriver.Key.ESCAPE).perform();
}


// async function iterateThroughPhotos(elements) {
//   for (let i = 1; i < elements.length; i++) {
//     let locatePhotoElement = await driver.wait(until.elementLocated(By.xpath('//*[@id="content"]/div/span/div/div[1]/div/main/div/div/div/div[1]/div[1]/div[1]/a/div/div[1]/div' + '/div[' + i + ']/div/img')), 120000);
//     let getSourceDownloadImageFile = await locatePhotoElement.getAttribute('src');
//     let file = fs.createWriteStream(__dirname + '/images/' + getSourceDownloadImageFile.split('').join('').slice(getSourceDownloadImageFile.length-10, getSourceDownloadImageFile.length));
//     let request = https.get(getSourceDownloadImageFile, (response) => {
//       response.pipe(file);
//     });
//     let moveToNextPhoto = await driver.actions().sendKeys(webdriver.Key.SPACE).perform();
//   }
// }

async function swipeCardsFunction(numberOfCards) {
  for (let i = 0; i < numberOfCards; i++) {
    let waitTillCardShows = await driver.wait(until.elementLocated(By.xpath('//*[@id="content"]/div/span/div/div[1]/div/main/div/div/div/div[1]/div[1]/div/div[3]/div[5]')), 120000);
    // let openProfile = await driver.actions().sendKeys(webdriver.Key.ARROW_UP).perform();
    // let waitTillCardOpens = await driver.wait(until.elementLocated(By.xpath('//*[@id="content"]/div/span/div/div[1]/div/main/div/div/div/div[1]/div[1]/div[1]/a/div/div[1]/div')), 120000);
    // let locatePhotos = await driver.findElements(By.xpath('//*[@id="content"]/div/span/div/div[1]/div/main/div/div/div/div[1]/div[1]/div[1]/a/div/div[1]/div/div'));
    // let findElements = await driver.findElements();
    // let iterate = await iterateThroughPhotos(locatePhotos);
    let moveToNextProfile = await moveToNextCard();
  }
}

async function scrape() {
  try {
    let goToFacebook = await driver.get('http://www.facebook.com/');
    let typeFacebookEmail = await driver.findElement(By.name('email')).sendKeys(secret.email);
    let typeFacebookPassword = await driver.findElement(By.name('pass')).sendKeys(secret.password);
    let clickLoginButton = await driver.findElement(By.id('loginbutton')).click();
    let goToTinder = await driver.get('http://www.tinder.com/');
    let waitForLoginPopup = await driver.wait(until.elementLocated(By.xpath('//*[@id="modal-manager"]/div/div/div[2]/div/div[3]/div[1]/button')), 120000);
    let clickLoginViaFacebook = driver.findElement(By.xpath('//*[@id="modal-manager"]/div/div/div[2]/div/div[3]/div[1]/button')).click();
    let swipeCards = await swipeCardsFunction(5000);
  } catch (err) {
    console.log('error running scraper: ', err);
  }
}

scrape();

// driver.quit();