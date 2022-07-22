const express = require('express')
const cors = require('cors')
const router = require('./router')

const app = express()
const port = 8080

app.use(express.json())
app.use(cors())
app.use(router)
// 统一异常处理
app.use((err, req, res, next) => {
    console.log('error: ' + err.message);
    res.send({
        code: 400,
        msg: err.message
    })
})

app.listen(port, () => {
    console.log(`Server started at http://127.0.0.1:${port}.`)
})
