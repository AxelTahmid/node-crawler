const truck_selector = '[data-testid="listing-ad"]'
const nextPage_selector = '[data-testid="pagination-step-forwards"]'
const lastPage_selector = '[data-testid="pagination-list-item"]'

const getNextPageUrl = async function (page) {
	try {
		await page.waitForSelector(nextPage_selector, {
			timeout: 5000
		})

		page.screenshot({ path: 'loaded.png' })

		await page.click(nextPage_selector)
		page.screenshot({ path: 'nextpage.png' })

		return page.url()
	} catch (error) {
		console.log(error.message)
	}
}

const findLastPage = function ($) {
	let lastPage = 0
	$(lastPage_selector).each((index, element) => {
		const num = $(element).find('a').text()
		lastPage = Math.max(lastPage, num)
	})
	return lastPage
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

module.exports = { findLastPage, getNextPageUrl, addItems, getTotalAdsCount }
