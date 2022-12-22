const puppeteer = require('puppeteer')
const cheerio = require('cheerio')
const log = require('./logger')
const crawler = require('./crawler')
const storage = require('./filesystem')
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

		const pageData = await page.evaluate(() => {
			return document.documentElement.innerHTML
		})
		log.info('HTML parsed')

		const $ = cheerio.load(pageData)
		log.info('HTML loaded in cheerio')

		const items = crawler.addItems($)
		log.info('Scrapped list of items')
		storage.updateJson('items.json', items)

		const count = crawler.getTotalAdsCount($)
		log.info(`got total ads count: ${count}`)
	} catch (error) {
		log.warn(error.message)
		log.info(error)
	} finally {
		await browser.close()
	}
})()
