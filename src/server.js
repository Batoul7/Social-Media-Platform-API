require("dotenv").config()

const app = require("./app");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 5000
const MONGOURL = process.env.MONGOURL;

mongoose.connect(MONGOURL)
    .then(() => {
        console.log("Connect with database done");

        app.listen(PORT, () => {
            console.log("Server is running successfully on", PORT)
        })
    })
    .catch(error => {
        console.log(error.message);
    });