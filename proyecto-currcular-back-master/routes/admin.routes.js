const {Router} = require('express');
const { check } = require('express-validator');
const { getReportVacancies, getReportUsers, getReportUser, activeReportVacancie, getReporVacancie  } = require('../controllers/admin.controller');
const { validateFields } = require('../middlewares/validateFields');
const { validateJWT } = require('../middlewares/validateJWT');
const router=Router();

router.get('/reported-vacancies',[
    validateJWT,
    validateFields,
],getReportVacancies);
router.get('/reported-vacancie/:id',[
    validateJWT,
    validateFields,
],getReporVacancie);
router.get('/reported-user/:id',[
    validateJWT,
    check('id','No es un id valido').isMongoId(),
    validateFields,
], getReportUser);
router.get('/reported-users',[
    validateJWT,
    validateFields,
],getReportUsers);
router.post('/clear-report-vacacie/:id',[
    validateJWT,
    check('id','No es un id valido').isMongoId(),
    check('uid','Error, es necesario el identificador de ususario para continuar'),
    validateFields,
],activeReportVacancie);


module.exports=router;