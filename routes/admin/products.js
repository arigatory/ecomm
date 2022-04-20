const express = require('express');

const router = express.Router();

router.get('/admin/products', (req, res) => {
    return res.send("prod");
});

router.get('/admin/products/new', (req, res) => {

});

module.exports = router;