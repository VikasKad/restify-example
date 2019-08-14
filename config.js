module.exports = {
    ENV: process.env.ENV || 'development',
    PORT: process.env.PORT || 3000,
    URL: process.env.URL || 'http://localhost:3000',
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://127.0.0.1/restify'
}