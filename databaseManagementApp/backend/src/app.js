
const express = require('express');
const app = express();
const cors = require("cors");
const db = require("../utils/db-connection");
const tableRoutes = require("../routers/tableRoute");
const recordRoutes = require("../routers/recordRoute");


require("../models/table");
require("../models/column");
app.use(cors());
app.use(express.json());

app.get("/", (req,res) => {
    res.send("Hieeeee!!");
})


app.use("/table", tableRoutes);
app.use("/record", recordRoutes);


db.sync({ alter: true }).then(()=> {
    app.listen(3000, () => {
    console.log("Server is running on port 3000");
})

}).catch((err) => {
console.log(err);
})

