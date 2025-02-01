const dotenv = require('dotenv')
dotenv.config();

const configs = {
    'DBConnection': process.env.DB_CONNECTION_STRING,
}
module.exports = configs;