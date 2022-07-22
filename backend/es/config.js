const es = require('elasticsearch');

const url = 'http://127.0.0.1:9200'
const index = 'news'
const type = '_doc'
const client = new es.Client({
    host: url
})

// client.ping()
//     .then(res => console.log('success', res))
//     .catch(err => console.error('fail', err))

module.exports = {
    url,
    client,
    index,
    type
}


