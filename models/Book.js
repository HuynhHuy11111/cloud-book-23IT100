const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
    {
        productCode: {
            type: String,
            required: true
        },

        name: {
            type: String,
            required: true
        },

        priceBeforeVAT: {
            type: Number,
            required: true
        },

        vatRate: {
            type: Number,
            required: true
        },

        priceAfterVAT: {
            type: Number,
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = bookSchema;