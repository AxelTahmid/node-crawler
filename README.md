# Mohammed Shahadat Hossain

This is a node.js web crawler, It mostly follows a `functional singleton pattern`. This was a first for me. Enjoyed creating a data scrapper and using puppeter for browser automation.

## Problem Given

Need to use: node - for running scraping cheerio - for parsing html file (https://www.npmjs.com/package/cheerio, used similarly as jquery) either `puppeteer` , iterated through all pages using `&page=<page number>` , got `item_id` & `item_url` , stored them in JSON.
 /playwright or request-promise for fetching ads Purpose: scrape otomoto.pl portal using provided interface.

BONUS: scraping via otomoto mobile app.
### Initial url 
https://www.otomoto.pl/ciezarowe/uzytkowe/mercedes-benz/od-2014/q-actros?search%5Bfilter_enum_damaged%5D=0search%5Border%5D=created_at%3Adesc

- Add getNextPageUrl function to iterate over pages
- Add addItems function that fetches item urls + item ids (unique ids that the portal uses) from list page
- Add getTotalAdsCount function - shows how many total ads exist for the provided initial url
- Add scrapeTruckItem function - that scrapes the actual ads and parses into the format: item id, title, price, registration date, production date, mileage, power
- Scrape all pages, all ads

## Solution Approach

I have used `request-promise` with `cheerio` to load initial first page and get the number of last page in pagination. 

I have then used that number, launched `puppeteer` , iterated through all pages using `&page=<page number>` param, got `item_id` & `item_url` , stored them in JSON file named `items.json`.

After which I loaded the `items.json` file which saved data from `puppeteer`. I found out the `API Server Link` by inspecting network requests in browser console, I was able to `bypass the security authorization block using < User-Agent: "request-promise" >` . I then proceeded to iterate through all id's from my loaded file and format the response data and store them into `trucks.json` . The pros of using API link was, It's extremely fast, much more than puppeteer. The cons are that I don't have the registration_date number.

I used both `puppeteer` and `request-promise` to showcase I am able to use both of them, when only one could've gotten the job done.

## Project Structure 
root contains all formatters, linters, scrips, dependencies
### Directory - src
- `index.js` is the entrypoint of the app with `iife function`
- `crawler.js` contains modularized functions named with given requirements
- `filesystem.js` read, insert and update data into JSON files
- `logger.js` simple colorized logger using `chalk`

## Installation Guide

Environment Requirements:

- `Node.js = 18`
- `Git Bash on Windows`
- `IDE: VSCode` ( optional )

Make sure you are in the root directory of project when running this

```
npm install
```

It will take a while because of `puppeteer` , iterated through all pages using `&page=<page number>` , got `item_id` & `item_url` , stored them in JSON.
 `, which will use a chromium browser for automation. Thats all, you're done.

## Get Started

Copy paste below line into command-line to get started

```
npm run start
```
