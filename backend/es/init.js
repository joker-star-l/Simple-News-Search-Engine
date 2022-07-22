const request = require('request');
const config = require('./config')

const url = config.url
const index = config.index
const headers = {
    "content-type": "application/json"
}

/**
 * title
 * abstract
 * content
 * time
 * origin
 * url
 * md5
 */
const body = {
    "settings": {
        "number_of_shards": 1,
        "number_of_replicas": 1
    },
    "mappings": {
        "properties": {
            "title": {
                "type": "text",
                "analyzer": "ik_max_word"
            },
            "abstract": {
                "type": "text",
                "analyzer": "ik_max_word"
            },
            "content": {
                "type": "text",
                "analyzer": "ik_max_word"
            },
            "time": {
                "type": "date",
                "format": "yyyy-MM-dd HH:mm"
            },
            "origin": {
                "type": "keyword"
            },
            "url": {
                "type": "keyword"
            },
            "md5": {
                "type": "keyword"
            }
        }
    }
}

request({url: `${url}/${index}`, method: 'PUT', headers: headers, body: JSON.stringify(body)}, (err, res, body) => {
    if (!err) {
        console.log(body)
    } else {
        console.log(err.message)
    }
})
