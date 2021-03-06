const express = require("express");
const connectDB = require("./config/db");

const app = express();
const PORT = process.env.PORT || 5000;

//NOTE connection to DB
connectDB();

app.get("/", (req, res) => {
    res.send("hello from express");
});

// NOTE parsing middleware
app.use(express.json({ extended: false }));

app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/posts", require("./routes/api/posts"));

app.listen(PORT, () => {
    console.log(`listening to port: ${PORT}`);
});
