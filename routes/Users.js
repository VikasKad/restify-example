const errors = require('restify-errors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Users = require('../models/Users');
const auth = require('../auth/auth');
const config = require('../config');
module.exports = server => {

    //register user
    server.post('/api/register', (req, res, next) => {
        const {
            email,
            password
        } = req.body;
        const user = new Users({
            email,
            password
        });
        try {
            bcrypt.hash(user.password, 10, async (err, hash) => {
                //Hash Password
                user.password = hash;
                await user.save();
                res.send(201);

            })
        } catch (err) {
            return next(new errors.InternalError(err.message));
        }
    })
    server.post('/api/auth', async (req, res, next) => {
        const {
            email,
            password
        } = req.body;
        try {
            const user = await auth.authenticate(email, password);
            console.log('user', user);
            const token = jwt.sign(user.toJSON(), config.JWT_SECRET, {
                expiresIn: '1h'
            })
            const {
                iat,
                exp
            } = jwt.decode(token);
            res.send({
                message: "user logged in successfully",
                data: {
                    expiresIn:exp,
                    token
                }
            })
            next();
        } catch (err) {
            return next(errors.UnauthorizedError(err))
        }

    })
}