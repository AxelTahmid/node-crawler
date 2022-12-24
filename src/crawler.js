const puppeteer = require('puppeteer')
const cheerio = require('cheerio')
const log = require('./logger')
const storage = require('./filesystem')

const truck_selector = '[data-testid="listing-ad"]'
const lastPage_selector = '[data-testid="pagination-list-item"]'

const baseApiUrl = 'https://www.otomoto.pl/api/v1/ad/'
const baseWebUrl =
	'https://www.otomoto.pl/ciezarowe/uzytkowe/mercedes-benz/od-2014/q-actros?search%5Bfilter_enum_damaged%5D=0&search%5Border%5D=created_at%3Adesc'

/**
 * * gets the last page number on given website
 */
const getLastPageNumber = async function (client, options) {
	return await client(options)
		.then($ => {
			let lastPage = 0
			$(lastPage_selector).each((index, element) => {
				const num = $(element).find('a').text()
				lastPage = Math.max(lastPage, num)
			})
			return lastPage
		})
		.catch(err => {
			log.debug(`Couldnt get lastpage number:  ${err.message}`)
		})
}

/**
 * * Add addItems function that fetches item urls + item ids
 * * (unique ids that the portal uses) from list page
 */
const addItems = function ($) {
	const itemsArray = []

	$(truck_selector).each((index, element) => {
		itemsArray.push({
			id: $(element).attr('id'),
			url: $(element).find('div > h2 > a').attr('href')
		})
	})

	return itemsArray
}

// * get total add count on current page
const getTotalAdsCount = function ($) {
	return $(truck_selector).length
}

// * iterate through all pages, using puppeteer
const getNextPageUrl = async function (lastPage) {
	const browser = await puppeteer.launch()
	log.info('headless browser launched')
	try {
		const page = await browser.newPage()
		log.info('tab opened')

		let pageData, $
		let totalCount = 0

		for (let index = 1; index <= lastPage; index++) {
			await page.goto(baseWebUrl + `&page=${index}`)
			log.debug(`Page: ${index}`)

			pageData = await page.evaluate(() => {
				return document.documentElement.innerHTML
			})

			$ = cheerio.load(pageData)
			log.info('Loaded Page HTML')

			const items = addItems($)
			log.info('Scrapped Data')
			storage.updateJson('items.json', items)
			log.info('Saved data')

			const count = getTotalAdsCount($)
			log.info(`ads count: ${count}`)
			totalCount = totalCount + count
		}

		log.debug(`total ads count: ${totalCount}`)
	} catch (error) {
		log.warn(`Crawling Error: ${error.message}`)
	} finally {
		await browser.close()
	}
}

const scrapeTruckItem = async function (client, truckID) {
	return await client({
		uri: baseApiUrl + truckID,
		headers: {
			'User-Agent': 'Request-Promise'
		},
		json: true
	})
		.then(data => {
			return [
				{
					id: data[truckID]?.id || '-',
					title: data[truckID]?.title_full || '-',
					price: data[truckID]?.params?.price?.valueHuman_en || '-',
					registration_date: '-',
					production_date: data[truckID]?.params?.year?.valueHuman_en || '-',
					mileage: data[truckID]?.params?.mileage?.valueHuman_en || '-',
					power: data[truckID]?.params?.engine_capacity?.valueHuman_en || '-'
				}
			]
		})
		.catch(err => {
			log.warn(`Error: ${err.message}`)
		})
}

module.exports = {
	getLastPageNumber,
	getNextPageUrl,
	addItems,
	getTotalAdsCount,
	scrapeTruckItem
}
