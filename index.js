const express = require('express');
const app = express();
const dotenv = require('dotenv');
const cors = require("cors");

app.use(express.json());
app.use(cors());

dotenv.config();

app.use(cors());
app.use("/api/users", require('./routes/userRoute'));
app.use('/api/pizzas', require('./routes/pizzaRoute'));
app.use("/api/orders", require("./routes/orderRoute"))

const server = app.listen(process.env.PORT || 7000, () => {
    console.log(`Listening to port: ${process.env.PORT}`);
})

//unhandled promise rejetcion
process.on("unhandledRejection", err => {
    console.log(`Error: ${err.message}`);
    console.log("Shutting down server  ")
    server.close(() => {
        process.exit(1);
    })
})