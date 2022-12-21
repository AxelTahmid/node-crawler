const puppeteer = require('puppeteer')
const cheerio = require('cheerio')
const log = require('./logger')
const baseURL =
	'https://www.otomoto.pl/ciezarowe/uzytkowe/mercedes-benz/od-2014/q-actros?search%5Bfilter_enum_damaged%5D=0&search%5Border%5D=created_at%3Adesc'

;(async () => {
	const browser = await puppeteer.launch()
	log.info('headless browser launched')

	try {
		const page = await browser.newPage()
		log.info('tab opened')

		await page.goto(baseURL)
		log.info('went to URL')

		// await page.screenshot({ path: 'image.png' })

		const pageData = await page.evaluate(() => {
			return document.documentElement.innerHTML
		})
		log.info('got all HTML')

		const $ = cheerio.load(pageData)

		// const advertisements = $('[data-testid="listing-ad"]').attr('id')
		const advertisements = []

		$('[data-testid="listing-ad"]').each((index, element) => {
			const itemId = $(element).attr('id')
			const itemUrl = $(element).find('div > h2 > a').attr('href')
			advertisements.push({ itemId, itemUrl })
		})

		console.log('html:', advertisements, 'count', advertisements.length)
	} catch (error) {
		log.warn(error.message)
		console.log(error)
	} finally {
		await browser.close()
	}
})()
