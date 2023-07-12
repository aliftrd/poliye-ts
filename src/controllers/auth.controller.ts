import { type NextFunction, type Request, type Response } from 'express'
import { resolveSuccessResponse } from '../helpers/response.helper'
import HttpStatusCode from '../enums/HttpStatusCode'
import { loginValidation } from '../validator/auth/login.validation'
import { validate } from '../validator/validation'
import type { Browser, Page, Dialog, HTTPResponse, Protocol } from 'puppeteer'
import { createBrowser } from '../applications/puppeteer'
import Exception from '../exceptions/Exception'
import { v4 as uuidv4 } from 'uuid'

const login = async (request: Request, response: Response, next: NextFunction): Promise<Response<string> | undefined> => {
  let browser: Browser | undefined
  try {
    const { nim, password } = validate(loginValidation, request.body)
    browser = await createBrowser()
    const [page]: Page[] = await browser.pages()

    const errorDialog: Promise<boolean> = new Promise<any>((resolve, reject): void => {
      page.on('dialog', async (dialog: Dialog): Promise<void> => { await dialog.dismiss() })
      page.on('response', async (response: HTTPResponse): Promise<void> => {
        if (response.url().includes('client.php')) {
          try {
            const message: string = await response.text()
            if (message.includes('salah')) {
              resolve(false)
            }
          } catch (e) {
            resolve(true)
          }
        }
      })
    })

    await page.goto('https://sim-online.polije.ac.id/')

    await page.$eval('input[name=txtEmail]', (el: HTMLInputElement, nim: string) => { el.value = nim }, nim)
    await page.$eval('input[name=txtPassword]', (el: HTMLInputElement, password: string) => { el.value = password }, password)

    await page.click('[type=button]')

    if (!await errorDialog) throw new Exception('NIM atau Password salah', 401)

    await page.waitForSelector('#content > div.splitcontentright > p:nth-child(1) > font > b')

    const data = await page.evaluate(() => {
      const rows: NodeListOf<Element> = document.querySelectorAll('table > tbody > tr')
      const data: any = {}
      for (const row of rows) {
        const [itemRowHeader, , itemRowChild] = row.querySelectorAll('td')
        const header: string = itemRowHeader.textContent?.replace(/\s+|[,/]/g, '') as string
        data[header] = itemRowChild.textContent?.trim()
      }

      return data
    })

    const cookie: Protocol.Network.Cookie[] = await page.cookies()
    await browser.close()

    const token: string = uuidv4()

    return resolveSuccessResponse(response, {
      code: HttpStatusCode.OK,
      message: 'User berhasil login',
      data: {
        token,
        user: data
      }
    })
  } catch (err) {
    if (browser != null) await browser.close()
    next(err)
  }
}

export default { login }
