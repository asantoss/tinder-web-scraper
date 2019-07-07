require('dotenv').config();
import fs from 'fs';
import request from 'request-promise';
import puppeteer from 'puppeteer'

const site = {
  facebook: {
    url: `http://www.facebook.com`,
    emailInput: `#email`,
    passwordInput: `#pass`,
    loginButton: `#u_0_2`
  }
}

export const scrape = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await loginFacebook(page);

  console.log('done');
  browser.close();
}

async function loginFacebook(page) {
  await page.goto(site.facebook.url);
  await page.type(site.facebook.emailInput, process.env.EMAIL)
  await page.type(site.facebook.passwordInput, process.env.PASSWORD)
  await page.click(site.facebook.loginButton)
  await page.waitForNavigation({ waitUntil: 'networkidle2' });
}

scrape();