const express = require('express');
const carts = require('../repositories/carts');
const cartsRepo = require('../repositories/carts');
const productsRepo = require('../repositories/products');
const cartShowTemplate = require('../views/carts/show');

const router = express.Router();

// Recieve a post req to add in item
router.post('/cart/products', async (req, res) => {
    // Figure out the cart!
    let cart;
    if (!req.session.cartId) {
        // We don't have a cart, so just
        // and store cart id ont hte req.session.cartId
        cart = await cartsRepo.create({ items: [] });
        req.session.cartId = cart.id;
    } else {
        // We have a cart!
        cart = await cartsRepo.getOne(req.session.cartId);
    }

    const existingItem = cart.items.find(item => item.id === req.body.productId);

    if (existingItem) {
        // inc
        existingItem.quantity++;
    } else {
        cart.items.push({ id: req.body.productId, quantity: 1 });
    }

    await cartsRepo.update(cart.id, {
        items: cart.items
    });
    res.redirect('/cart');
});


// Recieve a get to show Items
router.get('/cart', async (req, res) => {
    if (!req.session.cartId) {
        return redirect('/');
    }
    const cart = await cartsRepo.getOne(req.session.cartId);

    for (let item of cart.items) {
        const product = await productsRepo.getOne(item.id);

        item.product = product;
    }
    res.send(cartShowTemplate({ items: cart.items }));
});



//Recieve to delete an item
router.post('/cart/products/delete', async (req, res) => {
    const { itemId } = req.body;
    const cart = await cartsRepo.getOne(req.session.cartId);
    const items = cart.items.filter(item => item.id !== itemId);

    await cartsRepo.update(req.session.cartId, { items });

    res.redirect('/cart');
});
module.exports = router;
