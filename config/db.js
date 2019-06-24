const mongoose = require("mongoose");
const config = require("config");
const mongoURI = config.get("mongoURI");

const connectDB = async () => {
    try {
        await mongoose.connect(mongoURI, { useNewUrlParser: true });
        console.log("DB is connected");
    } catch (error) {
        console.error(error.message);
        //NOTE exit process if something is wrong
        process.exit(1);
    }
};

module.exports = connectDB;
