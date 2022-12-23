const items = require('../data/items.json')
const log = require('./logger')
const storage = require('./filesystem')
const crawler = require('./crawler')
const rp = require('request-promise')

items.map(async item => {
	log.info(`scraping item id: ${item.id}`)
	const truck = crawler.scrapeTruckItem(rp, item.id)
	log.debug(`scraping item id: ${item.id} complete!`)
	storage.updateJson('trucks.json', truck)
})
