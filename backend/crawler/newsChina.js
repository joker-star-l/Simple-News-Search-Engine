const request = require('request');
const cheerio = require('cheerio');
const moment = require('moment');
const crawlerUtil = require('./crawlerUtil');
const query = require('../es/query');

const url = 'https://channel.chinanews.com/cns/cjs2/gj.shtml' // ?pager=0&pagenum=9

const prefix = 'specialcnsdata = '
const postfix = '; newslist = specialcnsdata;'
const pager = 0
const pagenum = 360

function getUrl() {
    return `${url}?pager=${pager}&pagenum=${pagenum}`
}

function getTime(time) {
    let str = time.slice(0, 17)
    // return moment(str, 'YYYY年MM月DD日 HH:mm').utc(true).toDate()
    return moment(str, 'YYYY年MM月DD日 HH:mm').format('YYYY-MM-DD HH:mm')
}

function requestForDetails(url, callback) {
    request(crawlerUtil.getUri(url), (err, res, body) => {
        if (!err && res.statusCode === 200) {
            const $ = cheerio.load(body)
            let contentDOM = $("#cont_1_1_2 > div.left_zw > p")

            let title = $('#cont_1_1_2 > h1').text().trim()
            let content = ''
            contentDOM.each((i, el) => {
                content += $(el).text().trim() + '\n'
            })
            let abstract = content.slice(0, Math.min(100, content.length)).replace(/\n/g, ' ') + '...'
            let time = getTime($("#cont_1_1_2 > div.left-time > div").text().trim())
            let origin = $("#cont_1_1_2 > div.left-time > div").text().trim().slice(21, -4)

            let data = {
                title,
                abstract,
                content,
                time,
                origin,
                url,
            }
            callback(null, data)
        }  else {
            console.log(err)
        }
    })
}

// requestForDetails('https://www.chinanews.com.cn/gj/2022/07-19/9807090.shtml', (err, res) => {
//     console.log(res)
// })

request(crawlerUtil.getUri(getUrl()), (err, res, body) => {
    if (!err && res.statusCode === 200) {
        let data = body.trim().slice(prefix.length, -postfix.length)
        data = JSON.parse(data)['docs']
        // console.log(data)
        for (let i = 0; i < data.length; i++) {
            let d = data[i]
            // console.log(d);
            setTimeout(() => {
                requestForDetails(d['url'], (err, res) => {
                    console.log(d['url'])
                    query.insertOne(res, (err, res) => {
                        console.log(res)
                        console.log('finish')
                    })
                })
            }, 1000 * i)
            // break
        }
    } else {
        console.log(err.message)
    }
})

