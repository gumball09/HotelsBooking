const http = require('http')
const app = require('./app')
const { PORT } = require('./utils/config')
const logger = require('./utils/logger')
const { sequelize } = require('./utils/db')

const server = http.createServer(app)

sequelize.sync().then(() => {
    logger.info('Database connected.')
    server.listen(PORT, () => {
        logger.info(`Server listening on port ${PORT}`)
    })
}).catch((error) => {
    logger.error('Error setting up: ', error)
})