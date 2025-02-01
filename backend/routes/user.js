var express = require('express');
var user = require('../controllers/user.controller');
var router = express.Router();
var index = require('../controllers/index.controller');

// detecting existing user
router.head("/create", user.detectingUser);

/*GET users listing. */
router.get('/login/:id', index.getLogin);
router.get('/get', user.getUser);

/**
 * Create User
 * Created At: 
 * 
 */
router.post('/create', user.setUser);

// forget password 
router.put('/reset', user.resetPwd);

module.exports = router;
