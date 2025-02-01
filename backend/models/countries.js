var mongoose = require("mongoose");

const countries = new mongoose.Schema({
    countryName: {
        type: String,
    },
    countryShortCode: {
        type: String,
    },
    regions: [
        {
            name: {
                type: String
            },
            shortCode: {
                type: String
            }
        }
    ]
})

module.exports = mongoose.model('Countries', countries);
