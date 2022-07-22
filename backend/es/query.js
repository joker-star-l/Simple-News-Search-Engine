const md5 = require('md5')
const moment = require('moment')
const config = require('./config')

const client = config.client
const index = config.index
const type = config.type
const analyzer = 'ik_max_word'

function insertOne(data, callback=() => {}) {
    const dataMd5 = md5(data.abstract)
    client.search({
        index,
        type,
        body: {
            query: {
                match: {md5: dataMd5}
            }
        }
    })
        .then(res => {
            let dataList = res['hits']['hits']
            if (dataList.length === 0) {
                data.md5 = dataMd5
                client.index({
                    index,
                    type,
                    body: data
                })
                    .then(res => callback(null, res))
            }
        })
        .catch(err => console.log(err.message))
}

// insertOne({abstract: 'hello world!'})

function search(str, callback=() => {}, daysAgo=null) {
    let body = {
        query: {
            bool: {
                should: [
                    {match: {title: {
                                query: str,
                                analyzer,
                                minimum_should_match: '60%'
                            }}},
                    {match: {content: {
                                query: str,
                                analyzer,
                                minimum_should_match: '60%'
                            }}}
                ],
                minimum_should_match: 1
            }
        },
        sort: [
            {_score: 'desc'},
            {time: 'desc'}
        ]
    }

    if (daysAgo != null) {
        body.query.bool.filter = [
            {range: {time: {gte: moment().subtract(daysAgo, 'days').format('YYYY-MM-DD 00:00')}}}
            ]
    }

    client.search({
        index,
        type,
        body,
        size: 10000
    })
        .then(res => callback(null, res['hits']['hits']))
        .catch(err => callback(err, null))
}

// search('中国', (err, res) => {
//     console.log(res)
//     console.log(res.length)
// }, 7)

function searchCount(str, from, to, callback=() => {}) {
    let body = {
        query: {
            bool: {
                should: [
                    {match: {title: {
                                query: str,
                                analyzer,
                                minimum_should_match: '60%'
                            }}},
                    {match: {content: {
                                query: str,
                                analyzer,
                                minimum_should_match: '60%'
                            }}}
                ],
                minimum_should_match: 1,
                filter: [
                    {range: {time: {gte: from}}},
                    {range: {time: {lt: to}}}
                ]
            }
        }
    }

    client.count({
        index,
        type,
        body
    })
        .then(res => callback(null, res.count))
        .catch(err => callback(err, null))
}

// searchCount('中国', '2020-01-01 00:00', '2023-01-01 00:00', (err, res) => {
//     console.log(res)
// })

function deleteById(id, callback) {
    client.delete({
        index,
        type,
        id
    })
        .then(res => callback(null, res))
}

// deleteById('eiiyG4IBMnYJLphbLVFR', (err, res) => {
//     console.log(res)
// })

module.exports = {
    insertOne,
    search,
    searchCount,
    deleteById
}
