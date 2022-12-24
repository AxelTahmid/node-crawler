const puppeteer = require('puppeteer')
const cheerio = require('cheerio')
const rp = require('request-promise')
const log = require('./logger')
const crawler = require('./crawler')
const storage = require('./filesystem')

const baseWebUrl =
	'https://www.otomoto.pl/ciezarowe/uzytkowe/mercedes-benz/od-2014/q-actros?search%5Bfilter_enum_damaged%5D=0&search%5Border%5D=created_at%3Adesc'

;(async () => {
	const browser = await puppeteer.launch()
	log.info('headless browser launched')

	try {
		const page = await browser.newPage()
		log.info('tab opened')

		await page.goto(baseWebUrl)
		log.info('went to URL')

		let pageData = await page.evaluate(() => {
			return document.documentElement.innerHTML
		})
		log.info('HTML parsed')

		let $ = cheerio.load(pageData)
		log.info('HTML loaded in cheerio')

		const lastPage = crawler.findLastPage($)
		log.info(`pagination last page: ${lastPage}`)

		let totalCount = 0

		// * iterate through all pages, puppeteer
		for (let index = 1; index <= lastPage; index++) {
			await page.goto(baseWebUrl + `&page=${index}`)

			pageData = await page.evaluate(() => {
				return document.documentElement.innerHTML
			})

			$ = cheerio.load(pageData)

			const items = crawler.addItems($)
			log.info(`Scrapped Data from Page: ${index}`)
			storage.updateJson('items.json', items)

			const count = crawler.getTotalAdsCount($)
			log.info(`ads count: ${count}`)
			totalCount = totalCount + count
		}

		log.info(`got total ads count: ${totalCount}`)

		// * call api to get data of all items, request-promise
		const items = require('../data/items.json')

		if (items && items.length) {
			items.map(async item => {
				log.info(`scraping item id: ${item.id}`)
				const truck = await crawler.scrapeTruckItem(rp, item.id)
				log.debug(`scraping item id: ${item.id} complete!`)
				console.log('data received: ', truck)
				storage.updateJson('trucks.json', truck)
			})
		} else {
			log.debug('no items in json to iterate through')
		}
	} catch (error) {
		log.warn(error.message)
		log.info(error)
	} finally {
		await browser.close()
	}
})()
