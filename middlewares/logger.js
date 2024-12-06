const logger = (req, res, next) => {

    const now = new Date().toString()

    console.error(`
        Date:${now}
        method:${req.method}
        URL: ${req.url}
        `)

    next()
}

module.exports = logger