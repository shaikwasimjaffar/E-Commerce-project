
const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Home page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Place order
app.post("/api/orders", (req, res) => {
    const { customer, items, total } = req.body;

    if (!customer || !items || items.length === 0 || total <= 0) {
        return res.status(400).json({
            message: "Invalid order details"
        });
    }

    const order = {
        orderId: "ORD" + Date.now(),
        customer,
        items,
        total,
        date: new Date().toLocaleString()
    };

    console.log("New Order:", order);

    res.status(201).json({
        message: "Your order has been placed successfully!",
        orderId: order.orderId
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

