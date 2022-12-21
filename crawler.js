/**
 * * Add addItems function that fetches item urls + item ids
 * * (unique ids that the portal uses) from list page
 */
const addItems = function ($) {
	const itemsArray = []

	$('[data-testid="listing-ad"]').each((index, element) => {
		itemsArray.push({
			id: $(element).attr('id'),
			url: $(element).find('div > h2 > a').attr('href')
		})
	})

	return itemsArray
}

// * get total add count on current page
const getTotalAdsCount = function ($) {
	return $('[data-testid="listing-ad"]').length
}

module.exports = { addItems, getTotalAdsCount }
