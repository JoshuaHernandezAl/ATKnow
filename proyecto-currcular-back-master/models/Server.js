const express = require('express');
const cors = require('cors');
const {dbConnection} = require('../config/config-db');
const path = require('path');
class Server{
    constructor(){

        this.app = express();
        this.PORT=process.env.PORT;
        this.paths={
            users:'/api/users',
            vacancies:'/api/vacancies',
            auth:'/api/auth',
            payments:'/api/payments',
            admin:'/api/admin',
        }       
        
        //pug
        this.templates();

        //conexion db
        this.conectarDB();

        //middlewares
        this.middlewares();
        //rutas
        this.routes();
    }

    async conectarDB(){
        await dbConnection();
    }
    routes(){
        this.app.use(this.paths.users,require('../routes/users.routes'));
        this.app.use(this.paths.vacancies,require('../routes/vacancies.routes'));
        this.app.use(this.paths.auth,require('../routes/auth.routes'));
        this.app.use(this.paths.payments,require('../routes/payments.routes'));
        this.app.use(this.paths.admin,require('../routes/admin.routes'));
    }
    listen(){
        this.app.listen(this.PORT, (req, res) =>{
            console.log('Server on ',this.PORT);
        });
    }
    middlewares(){
        //cors
        this.app.use(cors());
        
        //Lectura y parseo del body
        this.app.use(express.json());
        this.app.use(express.urlencoded({extended:true}));


        //Servicios estaticos
        this.app.use(express.static('public'));

    }
    templates(){
        this.app.set('view engine', 'pug');
        this.app.set('views',path.join(__dirname, '../views'));
    }
}

module.exports=Server;