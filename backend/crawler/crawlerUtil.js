const commonHeaders = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36'
}


function getUri(url, method='GET', headers=commonHeaders) {
    return {
        url,
        method,
        headers
    }
}

module.exports = {
    getUri
}
