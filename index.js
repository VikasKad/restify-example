const restify = require('restify');
const mongoose = require('mongoose');
const config = require('./config');
const rjwt = require('restify-jwt-community');

const app = restify.createServer();

// midddleware
app.use(restify.plugins.bodyParser());
app.use(rjwt({
    secret: config.JWT_SECRET
}).unless('/auth'))
app.listen(config.PORT, () => {
    mongoose.connect(config.MONGODB_URI, {
        useNewUrlParser: true
    });
})
const db = mongoose.connection;
db.on('error', (err) => {
    console.log('DB error', err);

});
db.on('open', () => {
    require('./routes/customers')(app);
    require('./routes/users')(app);
    console.log(`server started on port number ${config.PORT}`);
})