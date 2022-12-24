const cheerio = require('cheerio')
const rp = require('request-promise')
const log = require('./logger')
const crawler = require('./crawler')
const storage = require('./filesystem')

const baseWebUrl =
	'https://www.otomoto.pl/ciezarowe/uzytkowe/mercedes-benz/od-2014/q-actros?search%5Bfilter_enum_damaged%5D=0&search%5Border%5D=created_at%3Adesc'

;(async () => {
	try {
		// to get paginable last page number
		const initialParser = {
			uri: baseWebUrl,
			headers: {
				'User-Agent': 'Request-Promise'
			},
			transform: function (body) {
				return cheerio.load(body)
			}
		}

		const lastPage = await crawler.getLastPageNumber(rp, initialParser)
		log.info(`pagination last page: ${lastPage}`)

		await crawler.getNextPageUrl(lastPage)

		// * call api to get data of all items, request-promise
		const items = require('../data/items.json')

		if (Array.isArray(items) && items.length) {
			items.map(async item => {
				log.info(`scraping item id: ${item.id}`)
				const truck = await crawler.scrapeTruckItem(rp, item.id)
				log.debug(`scraping item id: ${item.id} complete!`)
				storage.updateJson('trucks.json', truck)
			})
		} else {
			log.debug('no items in json to iterate through')
		}
	} catch (error) {
		log.warn(error.message)
		log.info(error)
	}
})()
