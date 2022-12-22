const truck_selector = '[data-testid="listing-ad"]'
const pagination_selector = '[data-testid="pagination-step-forwards"]'

const getNextPageUrl = async function (context) {
	await context.waitForSelector(pagination_selector, {
		timeout: 5000
	})
	await context.click(pagination_selector)
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

module.exports = { getNextPageUrl, addItems, getTotalAdsCount }
