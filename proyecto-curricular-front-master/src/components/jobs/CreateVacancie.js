import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { createVacancies } from '../../actions/vacancies';
import { useForm } from '../../hooks/useForm';
import { AuthMap } from '../ui/AuthUI/AuthMap';
import { ListSkills } from './helpers/ListSkills';

export const CreateVacancie = ({history}) => {
    const skills = ['HTML5', 'CSS3', 'CSSGrid', 'Flexbox', 'JavaScript', 'jQuery', 'Node', 'Angular', 'VueJS', 'ReactJS', 'React Hooks', 'Redux', 'Apollo', 'GraphQL', 'TypeScript', 'PHP', 'Laravel', 'Symfony', 'Python', 'Django', 'Sequelize', 'Mongoose', 'SQL', 'MVC', 'SASS', 'WordPress','C++','C','bash','Linux','C#','Java','Springboot','Go','Deno','R','Rust','No-SQL','Scala','Dart','Flutter'];
    const [requiredExp, setRequiredExp] = useState(false);
    const [academic, setAcademic] = useState({
        socialService:false,
        profesionalPractice:false,
    })
    const skillsActive=new Set();
    let skillsToSend=[];
    const {uid} = useSelector(state => state.auth);
    const {role} = useSelector(state => state.auth);
    const dispatch = useDispatch();

    const [vacanciesValues,handleVancanieInputChange]=useForm({
        title:'',
        company:'',
        salary:'',
        contract:'',
        description:'',
        experience:0,
    });
    const [location, setLocation] = useState({
        lat:'',
        lng:'',
        dir:'',
        state:'',
        city:'',
        country:'',
    });
    const {title,company,salary}=vacanciesValues;
    const handleSubmit=(e)=>{
        e.preventDefault();
        skillsToSend=[...skillsActive];
        vacanciesValues.description=document.querySelector("#description").value;
        if(vacanciesValues.title==='' || vacanciesValues.company==='' || vacanciesValues.salary==='' || vacanciesValues.contract==='' || vacanciesValues.description==='' || vacanciesValues.experience===''){
            Swal.fire('Error','Todos los campos son obligatorios');
            return;
        }
        if(skillsToSend.length===0){
            Swal.fire('Error','Seleccione al menos una habilidad que sea requirada para el candidato');
            return;
        }
        if(!location.lat || !location.lng || !location.dir){
            Swal.fire('Error','Ingresa una ubicación por medio del mapa');
            return;
        }
        if(!location.state || !location.city || !location.country){
            Swal.fire('Error','Especifica la ubiccación de la vacante por medio del pin del mapa');
            return;
        }
        let data={}
        if(academic.socialService){
            data={
                ...vacanciesValues,
                skills:skillsToSend,
                location,
                socialService:academic.socialService,
            }
        }else if(academic.profesionalPractice){
            data={
                ...vacanciesValues,
                skills:skillsToSend,
                location,
                profesionalPractice:academic.profesionalPractice,
            }
        }else{
            data={
                ...vacanciesValues,
                skills:skillsToSend,
                location,
            }
        }
        dispatch(createVacancies(data,uid));
        history.push('/home');
    }
    const handleExp=(e)=>{
        if(e.target.id!=='exp'){
            setRequiredExp(false);
            vacanciesValues.experience=0;
            handleAcademic(e);
            return;
        }
        setRequiredExp(true);
    }
    const handleAcademic=(e) => {
        if(e.target.id==='pp'){
            setAcademic({
                ...academic,
                profesionalPractice:true
            })            
            return;
        }else if(e.target.id==='ss'){
            setAcademic({
                ...academic,
                socialService:true
            })
        }
    }
    
    return (
        <>
            <h1 className="text-center">Crear una vacante</h1>
            <div className="pt-5 m-5" >
                <h2>Datos vacante:</h2>
                <form  className="default-form" onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="field col-11">
                            <label >Título:</label>
                            <input type="text" name="title" placeholder="Titulo de la vacante"  value={title} onChange={handleVancanieInputChange}/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="field col-11 ">
                            <label >Empresa:</label>
                            <input type="text" name="company" placeholder="Empresa"  value={company} onChange={handleVancanieInputChange} />
                        </div>
                    </div>
                    <div className="row">
                        <div className="field col-11">
                            <label >Sueldo:</label>
                            <input type="number" name="salary" placeholder="Sueldo"  value={salary} onChange={handleVancanieInputChange}/>
                            <p className="text-center text-muted">*Favor de colocar el sueldo en USD*</p>
                        </div>
                    </div>
                    <div className="row mb-5 ">
                        <div className="form-check form-check-inline col-md-3 mx-4 my-3 d-flex align-items-center">
                            <label className="form-check-label" >Experiencia requerida</label>
                            <input className="form-check-input" type="radio" name="current" id="exp"  onChange={handleExp}/>
                        </div>
                        <div className="form-check form-check-inline col-md-3 mx-4 my-3 d-flex align-items-center">
                            <label className="form-check-label" >Sin experiencia</label>
                            <input className="form-check-input" type="radio" name="current" id="no-exp"  onChange={handleExp}/>
                        </div>
                        {(role==='SS_ROLE')?
                            <>
                                <div className="form-check form-check-inline col-md-3 mx-4 my-3 d-flex align-items-center">
                                    <label className="form-check-label" >Practicas Profesionales</label>
                                    <input className="form-check-input" type="radio" name="current" id="pp"  onChange={handleExp}/>
                                </div>
                                <div className="form-check form-check-inline col-md-3 mx-4 my-3 d-flex align-items-center">
                                    <label className="form-check-label" >Servicio Social</label>
                                    <input className="form-check-input" type="radio" name="current" id="ss"  onChange={handleExp}/>
                                </div>
                            </>
                        :
                        ''
                        }
                        
                    </div>
                    {
                        requiredExp && (
                            <div className="row">
                                <div className="field col-11">
                                    <label >Experiencia:</label>
                                    <select  name="experience" onChange={handleVancanieInputChange} className="form-select">
                                        <option value="">---Selecciona---</option>
                                        <option value="6">6 meses a un año</option>
                                        <option value="24">1 a 2 años</option>
                                        <option value="36">2 a 3 años</option>
                                        <option value="40">Más de tres años</option>
                                    </select>
                                </div>
                                <p className="text-center text-muted">*Este parametro sirve para que los candidatos puedan encontrar su vancante más rapidamente,esté no se mostrara en la pagina de la vacante, puede especificar la experiencia exacta en la descripción de la vacante*</p>
                            </div>
                        )
                    }
                    <div className="row">
                        <div className="field col-11">
                            <label >Tipo de contrato:</label>
                            <select  name="contract" onChange={handleVancanieInputChange} className="form-select">
                            <option value="">---Selecciona---</option>
                                <option value="Freelance">Freelance</option>
                                <option value="Tiempo Completo">Tiempo Completo</option>
                                <option value="Medio tiempo">Medio tiempo</option>
                                <option value="Por proyecto">Por proyecto</option>
                            </select>
                        </div>
                    </div>
                    <div className="row">
                        <AuthMap setLocation={setLocation} location={location}/>
                    </div>
                    <div className="row">
                        <div className="field description col-11">
                            <label>Descripción:</label>
                            <input type="hidden" id="description" name="description" />
                            <trix-editor input="description"  ></trix-editor>
                        </div>
                    </div>
                    <div >
                        <ul className="knowledge-list">
                        {
                            skills.map((skill,i)=>(
                                <ListSkills key={i} skill={skill} skillsActive={skillsActive}/>
                            ))
                        }
                        </ul>
                    </div>
                    <div className="field row">
                        <p className="col-8"></p>
                        
                        <input type="submit" className="btn btn-primary btn-f-size__15 btn-f-weight__bold col-4" value="Publicar vacante"/>
                    </div>
                </form>
            </div>
        </>
    )
}