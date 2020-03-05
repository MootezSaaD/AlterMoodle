const router = require('express').Router();
const verifyJwt = require('./verifyToken');

router.post('/testjwt', verifyJwt, async(req, res) => {
    return res.status(201).send({
        success: true,
        message: 'JWT Works fine !'
    });

});

module.exports = router;