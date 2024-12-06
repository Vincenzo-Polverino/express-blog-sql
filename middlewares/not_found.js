const not_found = (req, res, next) => {

    res.status(404).send('Page not found')
}

module.exports = not_found