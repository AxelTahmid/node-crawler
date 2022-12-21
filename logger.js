/**
 * Doc: https://github.com/chalk/chalk#readme
 * Purpose: Terminal String Styler
 */
const chalk = require('chalk')

const info = text => console.log(chalk.bgBlue(text))

const warn = text => console.log(chalk.bgRedBright(text))

const debug = text => console.log(chalk.bgYellowBright(text))

module.exports = { info, warn, debug }
