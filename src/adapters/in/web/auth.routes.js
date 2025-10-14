// puzzlezer0/alphahealth/alphahealth-9ff70f5394a43fcdb875334e0d00e4eb39f098f9/src/adapters/in/web/auth.routes.js
const express = require('express');
const { register, login } = require('./auth.controller.js');
const router = express.Router();

router.post('/registrar', register);
router.post('/login', login);

module.exports = router;