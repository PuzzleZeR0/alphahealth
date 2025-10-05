// src/adapters/in/web/auth.routes.js

const express = require('express');
const { register, login } = require('./auth.controller.js');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

module.exports = router;