const request = require('request');
const cheerio = require('cheerio');
const moment = require('moment');
const crawlerUtil = require('./crawlerUtil');
const query = require('../es/query');

const url = 'http://xinhuanet.com/worldpro/ds_8d5294ed513c4779af6242a3623aa27b.json'
const count = 360

function getTime(time) {
    return moment(time, 'YYYY MM/DD HH:mm:ss').format('YYYY-MM-DD HH:mm')
}

function requestForDetails(url, callback) {
    request(crawlerUtil.getUri(url), (err, res, body) => {
        if (!err && res.statusCode === 200) {
            const $ = cheerio.load(body)
            let contentDOM = $("#detail > p")

            let title
            let content = ''
            contentDOM.each((i, el) => {
                content += $(el).text().trim() + '\n'
            })
            let abstract = content.slice(0, Math.min(100, content.length)).replace(/\n/g, ' ') + '...'
            let time
            let origin

            if ($("body > div.header > div.news-position > a.news-location").text() === '') {
                title = $("body > div.header.domPC > div.header-cont.clearfix > div.head-line.clearfix > h1 > span.title").text().trim()
                time = getTime($("body > div.header.domPC > div.header-cont.clearfix > div.header-time.left").text().trim())
                origin = $("body > div.header.domPC > div.header-cont.clearfix > div.source").text().trim().slice(3)
            } else {
                title = $("body > div.header > div.h-p3.clearfix > div > div.h-title").text().trim()
                time = $("body > div.header > div.h-p3.clearfix > div > div.h-info > span.h-time").text().trim().slice(0, -3)
                origin = $("body > div.header > div.h-p3.clearfix > div > div.h-info > span.sub-src > span").text().trim()
            }

            let data = {
                title,
                abstract,
                content,
                time,
                origin,
                url,
            }
            callback(null, data)
        } else {
            console.log(err)
        }
    })
}

// requestForDetails('http://www.news.cn/world/2022-07/14/c_1128832327.htm', (err, res) => {
//     console.log(res)
// })

request(crawlerUtil.getUri(url), (err, res, body) => {
    if (!err && res.statusCode === 200) {
        let data = JSON.parse(body)['datasource']
        // console.log(data)
        console.log(data.length)
        for (let i = 0; i < data.length; i++) {
            // console.log(d['publishUrl'])
            let d = data[i]
            setTimeout(() => {
                requestForDetails(d['publishUrl'], (err, res) => {
                    console.log(d['publishUrl'])
                    query.insertOne(res, (err, res) => {
                        console.log(res)
                    })
                })
            }, 1000 * i)

            if (i === count) {
                break
            }
        }
    } else {
        console.log(err.message)
    }
})
