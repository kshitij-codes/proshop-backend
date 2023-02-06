import asyncHandler from 'express-async-handler'
import Order from '../models/orderModel.js'

// Create New Order: POST /api/orders: Private
const addOrderItems = asyncHandler(async (req, res) => {
    const { orderItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body

    if(orderItems && orderItems.length === 0) {
        res.status(400)
        throw new Error('No Order items')
        return
    } else {
        const order = new Order({
            user: req.user._id, orderItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice
        })
        const createdOrder = await order.save()

        res.status(201).json(createdOrder)
    }
})

// Get Order by ID: GET /api/orders/:id: Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email')

  if(order) {
    res.json(order)
  } else {
    res.status(404)
    throw new Error('Order not found')
  }
})

export {
    addOrderItems, getOrderById
}