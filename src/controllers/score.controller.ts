import { type NextFunction, type Request, type Response } from 'express'
import { type Browser, type Page } from 'puppeteer'
import { resolveSuccessResponse } from '../helpers/response.helper'
import { validate } from '../validator/validation'
import { tahunSemesterValidation } from '../validator/tahun-semester.validation'
import { createBrowser, createBrowserPageWithCookie } from '../applications/puppeteer'

export default async function scoreController (request: Request, response: Response, next: NextFunction): Promise<Response<string> | undefined> {
  let browser: Browser | undefined
  try {
    const { token, cookie } = request.accessTokenData
    const { tahun, semester } = validate(tahunSemesterValidation, request.body)
    browser = await createBrowser()
    const page: Page = await createBrowserPageWithCookie({
      browser,
      token,
      cookie,
      url: 'https://sim-online.polije.ac.id/mNilaiSem.php'
    })

    await page.waitForSelector('#tdData > table > tbody > tr:nth-child(1) > td > div > h2')

    if (tahun != null) {
      await page.select('#tdData > table > tbody > tr:nth-child(3) > td > div > table > tbody > tr > td > table > tbody > tr:nth-child(2) > td:nth-child(2) > font > font > #cbSemester', tahun)
      await page.waitForNetworkIdle()
    }

    if (semester != null) {
      await page.select('#tdData > table > tbody > tr:nth-child(3) > td > div > table > tbody > tr > td > table > tbody > tr:nth-child(3) > td:nth-child(2) > font > font > #cbSemester', semester)
      await page.waitForNetworkIdle()
    }

    const years = await page.evaluate(() => {
      const yearsElement: Element | null = document.querySelector('#tdData > table > tbody > tr:nth-child(3) > td > div > table > tbody > tr > td > table > tbody > tr:nth-child(2) > td:nth-child(2) > font > font > #cbSemester')
      const data: string[] = Array.from(yearsElement?.querySelectorAll('option') as NodeListOf<HTMLOptionElement>).map((option: HTMLOptionElement) => option.value)
      const selected: string | undefined = Array.from(yearsElement?.querySelectorAll('option') as NodeListOf<HTMLOptionElement>).find((option: HTMLOptionElement) => option.selected)?.value
      return { data, selected }
    })

    const semesters = await page.evaluate(() => {
      const semestersElement: Element | null = document.querySelector('#tdData > table > tbody > tr:nth-child(3) > td > div > table > tbody > tr > td > table > tbody > tr:nth-child(3) > td:nth-child(2) > font > font > #cbSemester')
      const data: string[] = Array.from(semestersElement?.querySelectorAll('option') as NodeListOf<HTMLOptionElement>).map((option: HTMLOptionElement) => option.value)
      const selected: string | undefined = Array.from(semestersElement?.querySelectorAll('option') as NodeListOf<HTMLOptionElement>).find((option: HTMLOptionElement) => option.selected)?.value
      return { data, selected }
    })

    const scores: string[] = await page.evaluate(() => {
      const rows: NodeListOf<Element> = document.querySelectorAll('#tdData > table > tbody > tr:nth-child(3) > td > div > table > tbody > tr > td > table > tbody > tr:nth-child(4) > td:nth-child(2) > table > tbody > tr > td > table > tbody > tr')
      const data: any[] = []
      for (let i = 1; i < rows.length; i++) {
        const row = rows[i]
        const [codeMatkul, matkulName, nilaiMatkul] = row.querySelectorAll('td')

        data.push({
          codeMatkul: codeMatkul.textContent?.trim(),
          matkulName: matkulName.textContent?.trim(),
          nilaiMatkul: nilaiMatkul.textContent?.trim()
        })
      }

      return data
    })

    await browser.close()

    return resolveSuccessResponse(response, {
      code: 200,
      message: 'success',
      data: {
        meta: {
          years: {
            data: years.data,
            selected: years.selected
          },
          semesters: {
            data: semesters.data,
            selected: semesters.selected
          }
        },
        data: scores
      }
    })
  } catch (e) {
    if (browser != null) await browser.close()
    next(e)
  }
}
