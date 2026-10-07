const express = require("express");
const router = express.Router();

const {
    readConnection,
    writeConnection
} = require("../config/database");

const bookSchema = require("../models/Book");

// GET sẽ dùng tài khoản READ
const ReadBook = readConnection.model(
    "Book",
    bookSchema,
    "books"
);

// POST sẽ dùng tài khoản WRITE
const WriteBook = writeConnection.model(
    "Book",
    bookSchema,
    "books"
);

const MSSV = process.env.MSSV;

// MSSV = 23IT100
const PREFIX = MSSV.slice(-3); // 100

const lastDigit = Number(MSSV.slice(-1)); // 0

const VAT_RATE = lastDigit + 4; // 4%


// ================================
// XEM DANH SÁCH SÁCH - READ ACCOUNT
// ================================

router.get("/", async (req, res) => {

    try {

        const books = await ReadBook
            .find()
            .sort({ createdAt: -1 })
            .lean();

        res.render("books/index", {
            books,
            MSSV,
            FULL_NAME: process.env.FULL_NAME,
            PREFIX,
            VAT_RATE
        });

    } catch (error) {

        console.error(error);

        res.status(500).send(
            "Không thể đọc danh sách sách."
        );

    }

});


// ================================
// THÊM SÁCH - WRITE ACCOUNT
// ================================

router.post("/", async (req, res) => {

    try {

        const {
            productCode,
            name,
            price
        } = req.body;

        // Kiểm tra nhập đầy đủ
        if (!productCode || !name || !price) {

            return res
                .status(400)
                .send("Vui lòng nhập đầy đủ thông tin.");

        }

        // MSSV 23IT100 => prefix bắt buộc là 100
        if (!productCode.startsWith(PREFIX)) {

            return res
                .status(400)
                .send(
                    `Mã sản phẩm phải bắt đầu bằng ${PREFIX}`
                );

        }

        const priceBeforeVAT = Number(price);

        if (
            Number.isNaN(priceBeforeVAT) ||
            priceBeforeVAT < 0
        ) {

            return res
                .status(400)
                .send("Giá sản phẩm không hợp lệ.");

        }

        // MSSV cuối 0 => VAT = 0 + 4 = 4%
        const priceAfterVAT =
            priceBeforeVAT *
            (1 + VAT_RATE / 100);


        await WriteBook.create({

            productCode,

            name,

            priceBeforeVAT,

            vatRate: VAT_RATE,

            priceAfterVAT

        });


        res.redirect("/books");

    } catch (error) {

        console.error(error);

        res.status(500).send(
            "Không thể thêm sách."
        );

    }

});


module.exports = router;