import React, { useEffect, useState } from 'react'
import { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router';
import Swal from 'sweetalert2';
import { editVacancies, vacancieLoading } from '../../../actions/vacancies';
import { useForm } from '../../../hooks/useForm';
import { ListSkills } from '../../jobs/helpers/ListSkills';
import { AuthMap } from '../../ui/AuthUI/AuthMap';
import { Spinner } from '../../ui/Spinner';

export const EditVacancie = ({history}) => {
    const skillsForm = ['HTML5', 'CSS3', 'CSSGrid', 'Flexbox', 'JavaScript', 'jQuery', 'Node', 'Angular', 'VueJS', 'ReactJS', 'React Hooks', 'Redux', 'Apollo', 'GraphQL', 'TypeScript', 'PHP', 'Laravel', 'Symfony', 'Python', 'Django', 'Sequelize', 'Mongoose', 'SQL', 'MVC', 'SASS', 'WordPress','C++','C','bash','Linux','C#','Java','Springboot','Go','Deno','R','Rust','No-SQL','Scala','Dart','Flutter'];
    const dispatch = useDispatch();
    const {vacancieUrl} = useParams();
    let skillsToSend=[];
    const [requiredExp, setRequiredExp] = useState(false);
    const [academic, setAcademic] = useState({
        socialService:false,
        profesionalPractice:false,
    })
    const [showExp, setShowExp] = useState(false)
    useEffect(() => {
        dispatch(vacancieLoading(vacancieUrl));
    }, [dispatch,vacancieUrl]);
    const {vacancieActive,loading} = useSelector(state => state.vacancies);
    const {role,uid} = useSelector(state => state.auth);
    //console.log(vacancieActive);//!Esto hay que borrarlo
    const {title,company,salary,contract,description,experience,socialService,profesionalPractice,skills}=vacancieActive;
    const [location, setLocation] = useState({
        lat:'',
        lng:'',
        dir:'',
        state:'',
        city:'',
        country:'',
    });
    const skillsActive=new Set(skills);
    //console.log(skillsActive);
    const [vacanciesValues,handleVancanieInputChange]=useForm({
        title,
        company,
        salary,
        contract,
        description,
        experience,
    });
    const assing = useRef(false)
    useEffect(() =>{
        if(!loading && assing.current){
            vacanciesValues.title=title
            vacanciesValues.company=company
            vacanciesValues.salary=salary
            vacanciesValues.contract  =contract
            vacanciesValues.description=description
            vacanciesValues.experience=experience
            if(vacancieActive.location?.length > 0){
                setLocation({
                    lat:vacancieActive.location[0]||'',
                    lng:vacancieActive.location[1]||'',
                    dir:vacancieActive.location[2]||'',
                    state:vacancieActive.location[3]||'',
                    city:vacancieActive.location[4]||'',
                    country:vacancieActive.location[5]||'',
                })
            }
            if(experience!==0){
                setShowExp(true);
            }
            assing.current=false;
        }
    },[loading,vacancieActive,vacanciesValues,title,company,contract,description,experience,salary]);
    const handleDescriptionChange=(e)=>{
        e.preventDefault();
        console.log('Cambio de descripcion');
    }
    const handleExp=(e)=>{
        if(e.target.id!=='exp'){
            setRequiredExp(false);
            setShowExp(false);
            handleAcademic(e);
            vacanciesValues.experience=0;
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
    const handleSubmit=(e) => {
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
        // console.log(data);
        dispatch(editVacancies(data,uid,vacancieUrl));
        history.push('/home');
    }
    if(loading) {
        assing.current=true;
        return <Spinner/>
    }
    return (
        <>
            <h1 className="text-center mt-5">Editar vacante</h1>
            <div className="pt-3 m-5" >
                <h2>Datos vacante:</h2>
                <form  className="default-form" onSubmit={handleSubmit} >
                    <div className="row">
                        <div className="field col-11">
                            <label >Titulo:</label>
                            <input type="text" name="title" placeholder="Titulo de la vacante" value={vacanciesValues.title}  onChange={handleVancanieInputChange}/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="field col-11 ">
                            <label >Empresa:</label>
                            <input type="text" name="company" placeholder="Empresa" value={vacanciesValues.company} onChange={handleVancanieInputChange}/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="field col-11">
                            <label >Sueldo:</label>
                            <input type="number" name="salary" placeholder="Sueldo" value={vacanciesValues.salary} onChange={handleVancanieInputChange}/>
                            <p className="text-center text-muted">*Favor de colocar el sueldo es USD*</p>
                        </div>
                    </div>
                    <div className="row mb-5 ">
                        <div className="form-check form-check-inline col-md-3 mx-4 my-3 d-flex align-items-center">
                            <label className="form-check-label" >Experiencia requerida</label>
                            <input className="form-check-input" type="radio" name="current" id="exp"  defaultChecked={(experience!==0)?true:false} onChange={handleExp}/>
                        </div>
                        <div className="form-check form-check-inline col-md-3 mx-4 my-3 d-flex align-items-center">
                            <label className="form-check-label" >Sin experiencia</label>
                            <input className="form-check-input" type="radio" name="current" id="no-exp"  defaultChecked={(experience===0)?true:false} onChange={handleExp}/>
                        </div>
                        {(role==='SS_ROLE')?
                            <>
                                <div className="form-check form-check-inline col-md-3 mx-4 my-3 d-flex align-items-center">
                                    <label className="form-check-label" >Practicas Profesionales</label>
                                    <input className="form-check-input" type="radio" name="current" id="pp"  defaultChecked={(profesionalPractice)?true:false} onChange={handleExp}/>
                                </div>
                                <div className="form-check form-check-inline col-md-3 mx-4 my-3 d-flex align-items-center">
                                    <label className="form-check-label" >Servicio Social</label>
                                    <input className="form-check-input" type="radio" name="current" id="ss"  defaultChecked={(socialService)?true:false} onChange={handleExp}/>
                                </div>
                            </>
                        :
                        ''
                        }
                    </div>
                    {
                        (requiredExp || showExp) && (
                            <div className="row">
                                <div className="field col-11">
                                    <label >Experiencia:</label>
                                    <select  name="experience"  className="form-select" value={vacanciesValues.experience} onChange={handleVancanieInputChange}>
                                        <option value="">---Selecciona---</option>
                                        <option value="6">6 meses a un año</option>
                                        <option value="24">1 a 2 años</option>
                                        <option value="36">2 a 3 años</option>
                                        <option value="40">Más de tres años</option>
                                    </select>
                                </div>
                                <p className="text-center text-muted">*Este parametro sirve para que los candidatos puedan encontrar su vancante mas rapidamente,esté no se mostrara en la pagina de la vacante, puede especificar la experiencia exacta en la descripción de la vacante*</p>
                            </div>
                        )
                    }
                    <div className="row">
                        <div className="field col-11">
                            <label >Tipo de contrato:</label>
                            <select  name="contract"  className="form-select" value={vacanciesValues.contract} onChange={handleVancanieInputChange}>
                                <option value="">---Selecciona---</option>
                                <option value="Freelance">Freelance</option>
                                <option value="Tiempo Completo">Tiempo Completo</option>
                                <option value="Medio tiempo">Medio tiempo</option>
                                <option value="Por proyecto">Por proyecto</option>
                            </select>
                        </div>
                    </div>
                    <div className="row">
                        <AuthMap setLocation={setLocation} lat={vacancieActive.location[0]} lng={vacancieActive.location[1]} location={location}/>
                    </div>
                    <div className="row">
                        <div className="field description col-11">
                            <label>Descripción:</label>
                            <input type="hidden" id="description" name="description" value={description} onChange={handleDescriptionChange}/>
                            <trix-editor input="description"  ></trix-editor>
                        </div>
                    </div>
                    <div >
                        <ul className="knowledge-list">
                        {
                            skillsForm.map((skill,i)=>(
                                <ListSkills key={i} skill={skill} skillsActive={skillsActive}/>
                            ))
                        }
                        </ul>
                    </div>
                    <div className="field row">
                        <p className="col-8"></p>
                        
                        <input type="submit" className="btn btn-primary btn-f-size__15 btn-f-weight__bold col-4" value="Editar vacante"/>
                    </div>
                </form>
            </div>
        </>
    )
}
