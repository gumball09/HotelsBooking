const router = require('express').Router()
const logger = require('../utils/logger')
const middleware = require('../utils/middleware')
// ==============================================
const User = require('../models/User')

// ===== DASHBOARD =====
router.get('/dashboard', middleware.ensureLogin, (req, res) => {
    res.render('dashboard', {
        user: req.session.user
    })
})

// ===== LOGIN =====
router.get('/login', (req, res) => {
    res.render('login')
})

router.post('/login', async (req, res) => {
    User.findUser(req.body).then(result => {
        logger.info('Logged in as: ', result)
        // Save logged-in user info into request's session
        req.session.user = result
        setTimeout(() => { 
            res.redirect('/user/dashboard')
        }, 1500)
    }).catch(error => {
        res.render('login', { errorMsg: error, userEmail: req.body.email })
    })
})

// ===== SIGN UP =====
router.get('/register', (req, res) => {
    res.render('registerUser')
})

router.post('/register', (req, res) => {
    let errors = {};
    logger.info(req.body)
    const nameRegex = new RegExp('^[a-zA-Z]{2,30}$')
    if(!nameRegex.test(req.body.firstName)) errors.firstName = 'First Name must be 2-30 characters and contains letters only'
    if(!nameRegex.test(req.body.lastName)) errors.lastName = 'Last Name must be 2-30 characters and contains letters only'
    
    const pwdRegex = new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{6,12}$')
    if(!pwdRegex.test(req.body.password)) errors.password = 'Password must be 6-12 characters and contains numbers and characters only' 

    // Check if 'errors' object is empty
    if(!(Object.keys(errors).length === 0 && errors.constructor === Object)) {
        return res.render('registerUser', { errorMsg: req.body.password !== req.body.confirmPassword ? 'Passwords do not match' : null, errors, user: req.body })
    } 

    User.createUser(req.body).then(result => {
        setTimeout(() => {
            res.render('registerUser', { successMsg: 'Account successfully created!'})
        }, 1000)
    }).catch(error => {
        res.render('registerUser', { errorMsg: error, user: req.body })
    })
})

module.exports = router