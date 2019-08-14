const errors = require('restify-errors');
const Customer = require('../models/Customers');
const rjwt = require('restify-jwt-community');
const config = require('../config');
module.exports = server => {
    // create customer
    server.post('/api/customers', rjwt({
        secret: config.JWT_SECRET
    }), async (req, res, next) => {

        if (!req.is('application/json')) {
            return next(new errors.InvalidContentError("Expects application json"))
        }
        const {
            name,
            email,
            balance
        } = req.body;
        const customer = new Customer({
            name,
            email,
            balance // es6 will take care of name:name etc
        })
        try {
            const newCustomer = await customer.save();
            res.send(201);
            next();
        } catch (err) {
            return next(new errors.InternalError(err.message))
        }
    })

    //get customer
    server.get('/api/customers', async (req, res, next) => {
        try {
            const customers = await Customer.find({})
            res.send(customers);
            next();
        } catch (err) {
            return next(new errors.InvalidContentError(err))
        }
    })

    //get single customer
    server.get('/api/customers/:id', async (req, res, next) => {
        try {
            const customers = await Customer.findById(req.params.id)
            res.send(customers);
            next();
        } catch (err) {
            return next(new errors.ResourceNotFoundError(`There is no customer with id ${req.params.id}`))
        }
    })

    // Update customer
    server.put('/api/customers/:id', async (req, res, next) => {

        if (!req.is('application/json')) {
            return next(new errors.InvalidContentError("Expects application json"))
        }
        try {
            await Customer.findOneAndUpdate({
                _id: req.params.id
            }, req.body);
            res.send(200);
            next();
        } catch (err) {
            return next(new errors.ResourceNotFoundError(`There is no customer with id ${req.params.id}`))
        }
    })

    // Delete customer
    server.del('/api/customers/:id', async (req, res, next) => {

        if (!req.is('application/json')) {
            return next(new errors.InvalidContentError("Expects application json"))
        }
        try {
            await Customer.findOneAndRemove({
                _id: req.params.id
            });
            res.send(204);
            next();
        } catch (err) {
            return next(new errors.ResourceNotFoundError(`There is no customer with id ${req.params.id}`))
        }
    })

}