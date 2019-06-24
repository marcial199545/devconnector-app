const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.send("hello from express");
});

app.listen(PORT, () => {
    console.log(`listening to port: ${PORT}`);
});
