const express = require('express');
const router = express.Router();
const { knex } = require('../config/db/index')

const PIZZA_TABLE_NAME = "orders";

router.post('/placeorder', async (req, res) => {
    const { checkoutInfo, user, cartItems } = req.body;
    console.log('i am user', user[0]);
    const User = user[0]
    console.log('i am order', req.body)
    try {
        const order = req.body
        const insertedOrder = await knex('orders')
            .insert({
                userid: User.id,
                orderitems: cartItems,
                phoneNumber: checkoutInfo.number,
                shippingAddress: checkoutInfo.address,
                message: checkoutInfo.message,
                orderAmount: checkoutInfo.subTotal,
                isDelivered: 'Pending'
            })
            .returning("*");

        console.log(' order inserted', insertedOrder[0].id);
        const orderid = insertedOrder[0].id;
        const amountPaid = insertedOrder[0].orderAmount
        const insertedPayment = await knex('payment')
            .insert({
                userid: User.id,
                orderid: orderid,
                paidAmount: amountPaid
            })
            .returning("*");

        console.log('inserted', insertedOrder);
        console.log('inserted payment', insertedPayment);

        res.status(201).json({
            success: true,
            message: 'Order success',
            data: insertedOrder
        });

    } catch (error) {
        res.status(404).json({
            message: "Something went wrong"
        })
    }
});


router.post('/getuserorder', async (req, res) => {
    console.log('succes u\order');
    const user = req.body;
    console.log(user.userid)
    try {

        const order = await knex.select('*')
            .from('orders')
            .where('orders.userid', user.userid)
            .join('payment', 'orders.id', 'payment.orderid')
        console.log("ordersssss", order);
        res.status(200).send(order)


    } catch (error) {
        res.status(400).json({
            message: 'Something went Wrong',
            error: error.stack,
        });
    }
})

router.get("/alluserorder", async (req, res) => {
    const { userid } = req.body;
    try {
        const orders = await knex.select(`*`)
            .from("orders")
            .join('payment', 'orders.id', 'payment.orderid')

        res.status(200).send(orders);
    } catch (error) {
        res.status(400).json({
            message: "Something went wrong",
            error: error.stack,
        })
    }
})


module.exports = router;