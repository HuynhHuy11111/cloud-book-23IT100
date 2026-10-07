const mongoose = require("mongoose");

const readConnection = mongoose.createConnection(
    process.env.MONGO_READ_URI
);

const writeConnection = mongoose.createConnection(
    process.env.MONGO_WRITE_URI
);

readConnection.on("connected", () => {
    console.log("READ DATABASE CONNECTED");
});

writeConnection.on("connected", () => {
    console.log("WRITE DATABASE CONNECTED");
});

readConnection.on("error", (error) => {
    console.error("READ DATABASE ERROR:", error.message);
});

writeConnection.on("error", (error) => {
    console.error("WRITE DATABASE ERROR:", error.message);
});

module.exports = {
    readConnection,
    writeConnection
};