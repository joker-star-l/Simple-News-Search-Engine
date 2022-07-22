const request = require('request');
const cheerio = require('cheerio');
const crawlerUtil = require('./crawlerUtil');
const query = require('../es/query');

const baseUrl = 'https://world.gmw.cn'
const url = `${baseUrl}/node_4661.htm`
const pagenum = 1

function getUrl() {
    if (pagenum === 1) {
        return url
    } else {
        return `${baseUrl}/node_4661_${pagenum}.htm`
    }
}

function requestForDetails(url, callback) {
    request(crawlerUtil.getUri(url), (err, res, body) => {
        if (!err && res.statusCode === 200) {
            const $ = cheerio.load(body)
            let contentDOM = $("#article_inbox > div.u-mainText > p")

            let title = $("body > div.g-main > div.m-title-box > h1").text().trim()
            let content = ''
            contentDOM.each((i, el) => {
                content += $(el).text().trim() + '\n'
            })
            let abstract = content.slice(0, Math.min(100, content.length)).replace(/\n/g, ' ') + '...'
            let time = $("body > div.g-main > div.m-title-box > div > div.m_tips > span.m-con-time").text().trim()
            let origin = $("body > div.g-main > div.m-title-box > div > div.m_tips > span.m-con-source").text().trim().slice(3)

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

// requestForDetails('https://world.gmw.cn/2022-07/20/content_35897793.htm', (err, res) => {
//     console.log(res)
// })

request(crawlerUtil.getUri(getUrl()), (err, res, body) => {
    if (!err && res.statusCode === 200) {
        const $ = cheerio.load(body)
        let data = $('.channelMain .channel-newsGroup >li >a')
        console.log(data.attr('href'))
        let urls = []
        data.each((i, el) => {
            urls.push(`${baseUrl}/${$(el).attr('href')}`)
        })
        // console.log(urls);
        console.log(urls.length);
        for (let i = 0; i < data.length; i++) {
            let url = urls[i]
            setTimeout(() => {
                requestForDetails(url, (err, res) => {
                    console.log(url)
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
