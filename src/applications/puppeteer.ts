import puppeteer, { type Browser, type Page } from 'puppeteer'
import Exception from '../exceptions/Exception'
import { type CreatePageWithCookie } from '../types/types'

export const createBrowser = async (): Promise<Browser> => {
  return await puppeteer.launch({
    headless: true,
    ignoreHTTPSErrors: true,
    defaultViewport: null,
    // executablePath: process.platform === 'win32'
    //   ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
    //   : process.platform === 'linux'
    //     ? '/usr/bin/google-chrome'
    //     : '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    args: [
      '--ignore-certificate-errors',
      '--ignore-certificate-errors-spki-list ',
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--disable-gpu'
    ],
    ignoreDefaultArgs: ['--disable-extensions']
  })
}

export const createBrowserPageWithCookie = async (payload: CreatePageWithCookie): Promise<Page> => {
  const [page]: Page[] = await payload.browser.pages()

  await page.setCookie(...payload.cookie)
  await page.goto(payload.url, { waitUntil: 'domcontentloaded' })

  const hasLogoutButton = await page.$('#container > div.mainmenu > ul > li:nth-child(6) > a')
  if (hasLogoutButton == null) {
    throw new Exception('Unauthorized', 401)
  }

  return page
}
