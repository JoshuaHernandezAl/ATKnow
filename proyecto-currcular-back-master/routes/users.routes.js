const {Router} = require('express');
const {check} = require('express-validator');
const { getUsers, createUser, getUser, updateUser, deleteUser, ssRequest, getSSRequest, ssChecking, ssConfirm, ssReject, findSSRequest } = require('../controllers/users.controller');
const { uploadFile } = require('../middlewares/uploadFile');
const { validateFields,matchPassword, validateUser, validateAdmin } = require('../middlewares/validateFields');
const { validateJWT } = require('../middlewares/validateJWT');
const router=Router();


router.post('/create-user',[
    check('name','El nombre es obligatorio').not().isEmpty().escape(),
    check('email','El email es obligatorio').not().isEmpty().escape(),
    check('email','El email no es valido').isEmail(),
    check('password','La contraseña es obligatoria').not().isEmpty().escape(),
    check('password','La contraseña debe de ser al menos 6 caracteres').isLength({ min: 6 }),
    check('passwordMatch').custom((passwordMatch,{req},)=>(matchPassword(passwordMatch,req))),
    validateFields
],createUser);
//! Este endpoint de simulacion
router.post('/ss-checking',[
    validateJWT,
    check('idRequest','El numero de la petición es necesario para continuar con la revision').not().isEmpty(),
    validateFields,
],ssChecking);
router.post('/ss-confirm',[
    validateJWT,
    check('idRequest','El numero de la petición es necesario para continuar con la revision').not().isEmpty(),
    validateFields,
],ssConfirm);
router.post('/ss-reject',[
    validateJWT,
    check('idRequest','El numero de la petición es necesario para continuar con la revision').not().isEmpty(),
    validateFields,
],ssReject);
router.put('/update-user/:id',[
    uploadFile,
    validateJWT,
    validateUser,
    check('id','No es un id valido').isMongoId(),
    check('name','El nombre es obligatorio').not().isEmpty().escape(),
    check('email','El email es obligatorio').not().isEmpty().escape(),
    check('email','El email no es valido').isEmail(),
    validateFields
],updateUser);
router.put('/update-role-user/:id',[
    validateJWT,
    validateUser,
    check('id','No es un id valido').isMongoId(),
    validateFields
],ssRequest);
router.delete('/delete-user/:id',[
    validateJWT,
    check('id','No es un id valido').isMongoId(),
    validateAdmin,
    validateFields,
],deleteUser);

router.get('/users-ssrequest',[
    validateJWT,
    validateFields,
],getSSRequest);
router.get('/find-ssrequest/:ssIdRequest',[
    validateJWT,
    validateFields,
],findSSRequest);
router.get('/get-users',[],getUsers);
router.get('/get-user/:id',[
    check('id','No es un id valido').isMongoId(),
    validateFields
],getUser);

module.exports=router;