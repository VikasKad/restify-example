const bcrypt = require('bcryptjs');
const Users = require('../models/Users');
const mongoose = require('mongoose');

exports.authenticate = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await Users.findOne({
                email
            })
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err)
                    throw err;
                if (isMatch) {
                    resolve(user);
                } else {
                    reject('Authentication failed');
                }
            })
        } catch (err) {
            //email not found
            reject('Authentication failed');
        }
    })
}