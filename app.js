require("dotenv").config();

const express = require("express");

const session = require("express-session");

const { MongoStore } = require("connect-mongo");

const {
    engine
} = require("express-handlebars");

// Nạp kết nối READ/WRITE
require("./config/database");

const bookRoutes = require(
    "./routes/bookRoutes"
);


const app = express();


// ================================
// HANDLEBARS
// ================================

app.engine(
    "handlebars",
    engine({
        defaultLayout: "main"
    })
);

app.set(
    "view engine",
    "handlebars"
);

app.set(
    "views",
    "./views"
);


// ================================
// MIDDLEWARE
// ================================

app.use(
    express.urlencoded({
        extended: true
    })
);

app.use(express.json());

app.use(
    express.static("public")
);


// ================================
// SESSION LƯU TRÊN MONGODB ATLAS
// ================================

app.use(
    session({

        secret:
            process.env.SESSION_SECRET,

        resave: false,

        saveUninitialized: false,

        store: MongoStore.create({

            mongoUrl:
                process.env.MONGO_SESSION_URI,

            collectionName:
                "sessions"

        }),

        cookie: {

            maxAge:
                1000 * 60 * 60,

            httpOnly: true

        }

    })
);


// Tạo dữ liệu session để Atlas thực sự lưu session
app.use((req, res, next) => {

    if (!req.session.visitCount) {

        req.session.visitCount = 1;

    } else {

        req.session.visitCount++;

    }

    next();

});


// ================================
// ROUTES
// ================================

app.get("/", (req, res) => {

    res.redirect("/books");

});

app.use(
    "/books",
    bookRoutes
);


// ================================
// START SERVER
// ================================

const PORT =
    process.env.PORT || 3000;


app.listen(PORT, () => {

    console.log(
        `Server running on http://localhost:${PORT}`
    );

});