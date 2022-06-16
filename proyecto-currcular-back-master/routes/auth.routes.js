const {Router} = require('express');
const {check} = require('express-validator');
const { login, renewToken, activeAccount, resetPassword, resetPasswordEmail } = require('../controllers/auth.controller');
const { validateFields, matchPassword } = require('../middlewares/validateFields');
const { validateJWT } = require('../middlewares/validateJWT');
const router=Router();

router.post('/login',[
    check('email','El email es obligatorio').isEmail().escape(),
    check('password','La password es obligatoria').not().isEmpty().escape(),
    validateFields,
],login);

router.get('/renew',[
    validateJWT,
],renewToken);

router.put('/active-acount/:token',[],activeAccount);
router.post('/reset-password-email',[
    check('email','El email es obligatorio').not().isEmpty().escape(),
    check('email','El email no es valido').isEmail(),
],resetPasswordEmail);
router.put('/reset-password',[
    check('password','La contraseña es obligatoria').not().isEmpty().escape(),
    check('password','La contraseña debe de ser al menos 6 caracteres').isLength({ min: 6 }),
    check('passwordMatch').custom((passwordMatch,{req},)=>(matchPassword(passwordMatch,req))),
    validateFields
],resetPassword);

module.exports=router;

