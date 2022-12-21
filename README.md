# Mohammed Shahadat Hossain

This is a node.js web crawler, It mostly follows a `functional singleton pattern`. This was quite enjoyable to be honest.

## Problem Given

Need to use: node - for running scraping cheerio - for parsing html file (https://www.npmjs.com/package/cheerio, used similarly as jquery) either puppeteer/playwright or request-promise for fetching ads Purpose: scrape otomoto.pl portal using provided interface.

BONUS: scraping via otomoto mobile app.
### Initial url 
https://www.otomoto.pl/ciezarowe/uzytkowe/mercedes-benz/od-2014/q-actros?search%5Bfilter_enum_damaged%5D=0search%5Border%5D=created_at%3Adesc

- Add getNextPageUrl function to iterate over pages
- Add addItems function that fetches item urls + item ids (unique ids that the portal uses) from list page
- Add getTotalAdsCount function - shows how many total ads exist for the provided initial url
- Add scrapeTruckItem function - that scrapes the actual ads and parses into the format: item id, title, price, registration date, production date, mileage, power
- Scrape all pages, all ads

### Questions/thoughts:
- Ideas for error catching/solving, retry strategies?
- Accessing more ads from this link than the limit allows (max 50 pages)?
- Experience with CI/CD tools?
- Other considerations?


## Project Structure

I have used the industry standard for javascript, formatter `Prettier` and linter `eslint` throughout the project to maintain same style of code and deal with javascripts bugs. A `Dockerfile` to containerize the app is included but I intentionally didn't make it functional as I wanted the build context to be project root but data was outside of this scope and Docker only has access to current context. Anyways, Here's the important bit:

- `index.js` is the entrypoint of the app
- `utils` contains modularized functions
  - `filter.js` is where all the data filtering is happening. functions description is given with comment
  - `jsondata.js` dynamically reads all json files in data folder and creates array from them with necessary data only
  - `logger.js` just a colorized console.log function really
  - `validator.js` modularized validation for scalability

## Installation Guide

Don't change given directory structure, since `data` folder is outside of `src` / `root of project`

Environment Requirements:

- `Node.js >= 18`
- `Git Bash on Windows`
- `IDE: VSCode` <- you'll get nice intellesense when hovering on function cause of comment description

Make sure you are in the root directory of project when running this

```
npm install
```

Thats all, you're done.

## Get Started

I used `yargs` to build the cli app, since I had time constraints. It helped me scaffold a neat descriptive cli helper within seconds. to get started , inside src, i.e root of project, enter the followinig:

```
node . --help
```

you should see the following:

```
$ node . --help
Options:
      --help       Show help                                           [boolean]
      --version    Show version number                                 [boolean]
  -t, --type       Filter user by active, superactive or bored
                                                             [string] [required]
  -s, --startdate  Starting Date in format YYYY-MM-DD        [string] [required]
  -e, --enddate    Ending Date in format YYYY-MM-DD          [string] [required]
```

I think the above bit is quite self explanatory. I did not use positional arguments, I did see example was given with positional arguements but I prefer to know what I am feeding to my CLI, thus I went for flags. The properly named flags also have small alias. So you could use both, but I prefer to use the shorthand.

the flag inputs need to be prefixed with a `node . ` which tells `node.js` to look for a `index.js` file in root context and run it.

```
node . --type <type> --startdate <start date> --enddate <end date>

node . -t <type> -s <start date> -e <end date>

node . -t active -s 2016-08-01 -e 2016-08-20
```

and for this specific case result should be

```
active users:
2,7,10780,17172,30024,30332,31870,33550,34407,34429
```

As you can see, The results are instant. This is mostly cause `JSON` or `Javascript Object Notation` has first class support by `JavaScript` , which is the codebase really, `Node.js` is just the runtime.
