const {Router} = require('express');
const {check} = require('express-validator');
const { searchFast, searchAdvanced } = require('../controllers/search.controller');
const { getVacancies, createVacancie, getVacancie, deleteVacancie, updateVacancie, contact, firstJob, socialService, randomVacanciePremium, bestVacancies, reportVacancie, vacancieByUser, suspendVacancie, activeVacancie, profesionalPratices, bestVacancieByUser } = require('../controllers/vancies.controller');
const { uploadFile } = require('../middlewares/uploadFile');
const { validateFields, validateAdmin, validateAuthor } = require('../middlewares/validateFields');
const { validateJWT } = require('../middlewares/validateJWT');
const router=Router();

//* Get first job vancancies
router.get('/first-job',[],firstJob);
//* Get social service vacacies
router.get('/social-service',[],socialService);
//* Get profesional practices vacancies 
router.get('/profesional-practices',[],profesionalPratices);
//* Get one random premium vacancie
router.get('/premium-vacancie',[],randomVacanciePremium);
//* Get best vacancies
router.get('/best-vacancies/:premium?',[],bestVacancies);
//* Vacancie by user
router.get('/user/:id',[
    validateJWT,
    check('id','Usuario invalido').isMongoId(),
    validateFields
],vacancieByUser);
//*Quick search
router.get('/search-fast/:query?',[],searchFast);
//*Advance search
router.post('/search-advanced',[
    check('state','El estado es obligatorio').not().isEmpty(),
    check('city','La ciudad es obligatoria').not().isEmpty(),
    check('title','La vacante es obligatoria').not().isEmpty(),
    validateFields,
],searchAdvanced);
//*Best vacancies by user
router.get('/best-vacancies-user/:id',[
    validateJWT,
    check('id','Usuario invalido').isMongoId(),
    validateFields
],bestVacancieByUser);
//* Get one vacacie
router.get('/:url',[],getVacancie);
//* Get all vacacies
router.get('/',[],getVacancies);

//* create vacacie
router.post('/',[
    validateJWT,
    check('title','El nombre es obligatorio').not().isEmpty(),
    check('company','La empresa es obligatoria').not().isEmpty(),
    check('salary','El salario es obligatorio').not().isEmpty(),
    check('contract','El tipo de contrato es obligatorio').not().isEmpty(),
    check('description','La descripcion del puesto es obligatoria').not().isEmpty(),
    check('skills','Las habilidades son obligatorias').not().isEmpty(),
    check('experience','La experiencia deseada es obligatoria').not().isEmpty(),
    validateFields,
],createVacancie);
//* update  vacancie
router.put('/:url',[
    validateJWT,
    check('title','El nombre es obligatorio').not().isEmpty(),
    check('company','La empresa es obligatoria').not().isEmpty(),
    check('salary','El salario es obligatorio').not().isEmpty(),
    check('contract','El tipo de contrato es obligatorio').not().isEmpty(),
    check('description','La descripcion del puesto es obligatoria').not().isEmpty(),
    check('skills','Las habilidades son obligatorias').not().isEmpty(),
    validateAuthor,
    validateFields,
],updateVacancie)
//* delete vacacie
router.delete('/:url',[
    validateJWT,
    validateAdmin,
    validateFields,
],deleteVacancie);
//* contact employer
router.post('/candidates/:url',[
    uploadFile,
    check('name','El nombre es obligatorio').not().isEmpty(),
    check('email','El email es obligatorio').not().isEmpty(),
    check('email','El email no es valido').isEmail(),
    validateFields,
],contact);
//*Report vacancie
router.put('/report/:url',[
    check('email','El email es obligatorio').not().isEmpty(), 
    check('email','El email no es valido').isEmail(),
    check('reason','Escribe la razon por la que estas reportando esta vacante').not().isEmpty(),
    validateFields,
],reportVacancie);
//* Supend vacancie 
router.put('/suspend/:url',[
    validateJWT,
    validateAuthor,
    validateFields,
],suspendVacancie);
//*Active vacancie
router.put('/active/:url',[
    validateJWT,
    validateAuthor,
    validateFields,
],activeVacancie);


module.exports=router;
