const {Router} = require('express');
const { check } = require('express-validator');
const { payment } = require('../controllers/payments.controller');
const { validateFields } = require('../middlewares/validateFields');
const { validateJWT } = require('../middlewares/validateJWT');
const router=Router();

router.post('/payment',[
    validateJWT,
    check('id','Error, al generar el id de pago').not().isEmpty(),
    check('months','Seleciona la cantidad de meses que requires ser premium').not().isEmpty(),
    validateFields
],payment);


module.exports=router;