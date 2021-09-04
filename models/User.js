const { sequelize } = require('../utils/db')
const logger = require('../utils/logger')
const { DataTypes } = require('sequelize')
const bcrypt = require('bcrypt')

const User = sequelize.define("User", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isAlpha: true,
            len: [2, 30]
        }
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            isAlpha: true,
            len: [2, 30]
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    passwordHash: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: true,
    updatedAt: false,
    freezeTableName: true // set the table name to be the same as model name
})

const createUser = (data) => {
    return new Promise((resolve, reject) => {
        bcrypt.hash(data.password, 10).then(passwordHash => {
            logger.info('Password hash: ', passwordHash)

            const user = {
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                passwordHash
            }

            User.create(user, { raw: true }).then(result => {
                logger.info('New user created: ', result.dataValues)
                resolve(result.dataValues)
            }).catch(error => {
                logger.error('Error creating new user: ', error)
                reject('Error creating new user: ', error)
            })
        })
    })
}

const findUser = (data) => {
    return new Promise((resolve, reject) => {
        User.findOne({ 
            where: {
                email: data.email
            }
        }, { raw: true }).then(user => {
            if(!user.dataValues) {
                reject('User not found!')
            } else {
                bcrypt.compare(data.password, user.dataValues.passwordHash, (error, result) => {
                    // if result === true
                    if(result) {
                        resolve({
                            firstName: user.dataValues.firstName,
                            lastName: user.dataValues.lastName,
                            email: user.dataValues.email
                        })
                    } else {
                        reject('Password does not match')
                    }
                })
            }
        }).catch(() => {
            reject('User not found!')
        })
    })
}

module.exports = { createUser, findUser }