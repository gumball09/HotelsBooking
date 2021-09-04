const express = require('express')
const exphbs = require('express-handlebars')
const path = require('path')
const helmet = require('helmet')
const clientSessions = require('client-sessions')
// =================================================================
const { SESSION_KEY } = require('./utils/config')
const middleware = require('./utils/middleware')
// =================================================================
const userRouter = require('./controllers/user')

const app = express()

const User = require('./models/User')

//User.createUser({
    //firstName: 'Vivian',
    //lastName: 'Pham',
    //email: 'hpnpham@myseneca.ca',
    //password: 'Couple2vs'
//}).then(result => {
    //console.log('Newly created user: ', result)
//}).catch(err => console.log(err))

// SERVER CONFIGURATIONS
// Serve static files (CSS)
app.use(express.static(path.join(__dirname, 'public')))

// Increased security for HTTP headers
app.use(helmet()) 

// Use of sessions for authentication
app.use(clientSessions({
    cookieName: "authentication",
    secret: SESSION_KEY,
    duration: 3600 *2,
    activeDuration: 3600 * 2,
    cookie: {
        path: '/', // cookie will only be sent to requests under '/'
        ephemeral: true, // when true, cookie expires when the browser closes
        httpOnly: true, // when true, cookie is not accessible from javascript
        secure: false // when true, cookie will only be sent over SSL. use key 'secureProxy' instead if you handle SSL not in your node process
    }
}))

// Use of JSON-Parser to parse data in requests
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// Set templating engine
app.set('view engine', 'hbs')
const hbs = exphbs.create({
    layoutsDir: path.join(__dirname, 'views/layouts'),
    partialsDir: path.join(__dirname, 'views/partials'),
    extname: 'hbs',
    defaultLayout: 'main'
})
app.engine('hbs', hbs.engine)

// LOGGER MIDDLEWARE: Logs info for every request
app.use(middleware.requestLogger)

// ===== USE OF ROUTES =====
app.use('/user', userRouter)

// UNKNOWN ENDPOINTS MIDDLEWARE: Handle unknown endpoints
app.use(middleware.unknownEndpoint)

// ERROR MIDDLEWARE: Handle invalid requests
app.use(middleware.errorHandler)

module.exports = app