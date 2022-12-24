const { readFileSync, writeFileSync } = require('node:fs')
const { join } = require('node:path')

const log = require('./logger')

const jsonReader = fileName => {
	try {
		const jsonData = readFileSync(
			`${join(__dirname, '..', 'data')}/${fileName}`
		)

		return JSON.parse(jsonData)
	} catch (error) {
		log.info('file empty', error.message)
		return []
	}
}

const saveJson = (fileName, data) => {
	try {
		const formattedData = JSON.stringify(data, null, 2)

		writeFileSync(`${join(__dirname, '..', 'data')}/${fileName}`, formattedData)
	} catch (error) {
		log.warn(error.message)
	}
}

const updateJson = (fileName, data) => {
	try {
		const prevData = jsonReader(fileName)
		saveJson(fileName, [...prevData, ...data])
	} catch (error) {
		log.warn(error.message)
	}
}

module.exports = { jsonReader, saveJson, updateJson }
