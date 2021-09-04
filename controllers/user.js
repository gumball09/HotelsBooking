const router = require('express').Router()
const logger = require('../utils/logger')
// ==============================================
const User = require('../models/User')

// ===== LOGIN =====
router.get('/login', (req, res) => {
    res.render('login')
})

router.post('/login', async (req, res) => {
    User.findUser(req.body).then(result => {
        logger.info('Logged in as: ', result)
    }).catch(error => {
        logger.error('Cannot log in: ', error)
        res.render('login', { errorMsg: error, userEmail: req.body.email })
    })
})

module.exports = router