const express = require('express')
const moment = require('moment')
const responseUtil = require('./responseUtil')
const query = require('../es/query');

const router = express.Router()

/**
 * 搜索接口
 * req.query: {
 *     words: string,
 *     daysAgo: int
 * }
 */
router.get('/search', (req, resp) => {
    const data = req.query
    query.search(data['words'], (err, res) => {
        if (!err) {
            resp.send(responseUtil.success(res))
        } else {
            throw err
        }
    }, data['daysAgo'])
})

/**
 * 统计接口
 * req.query: {
 *     words: string
 * }
 */
router.get('/analyze', (req, resp) => {
    const data = req.query
    let days = []
    let counts = []
    const start = moment().subtract(6, 'days')
    const next = moment().subtract(5, 'days')
    searchCount(data['words'], days, counts, start, next, 6, resp)
})

function searchCount(words, days, counts, start, next, i, resp) {
    query.searchCount(words,
        start.format('YYYY-MM-DD 00:00'),
        next.format('YYYY-MM-DD 00:00'), (err, res) => {
        if (!err) {
            days.push(start.format('YYYY-MM-DD'))
            counts.push(res)
            if (i === 0) {
                resp.send(responseUtil.success({days, counts}))
            } else {
                searchCount(words, days, counts, start.add(1, 'days'), next.add(1, 'days'), i - 1, resp)
            }
        } else {
            throw err
        }
    })
}

module.exports = router
