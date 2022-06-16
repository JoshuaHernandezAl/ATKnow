import React,{useEffect, useState} from 'react';
import { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams,Redirect } from 'react-router';
import Swal from 'sweetalert2';
import { startReportVacancie, uploadCV, vacancieLoading } from '../../actions/vacancies';
import { useForm } from '../../hooks/useForm';
import { Alert } from '../ui/Alert';
import { MapView } from '../ui/MapView';
import { Spinner } from '../ui/Spinner';
import { Skill } from './Skill';

export const DetailView = ({history}) => {
    const [error, setError] = useState('');
    const [file, setFile] = useState('');
    const [candidateInfo, setCandiadteInfo] = useState({
        name:'',
        email:'',
    });
    const [formReportValues,handleReportInputChange,resetReport]=useForm({
        email:'',
        reason:'',
        institute:'',
        semester:'',
    });
    const {vacancieUrl}=useParams();
    const dispatch = useDispatch();
    const {vacancieActive,loading} = useSelector(state => state.vacancies);
    
    const vacancieActiveRef=useRef(vacancieActive);
    useEffect(() => {
        dispatch(vacancieLoading(vacancieUrl))
        if(Object.keys(vacancieActiveRef.current).length===0){
            return <Redirect to='/'/>
        }
    }, [dispatch,vacancieUrl]);
    
    useEffect(() => {
        window.scroll(0,0);
    }, []);

    const {company,location,contract,salary,description,skills,title,author,url,socialService,profesionalPractice} = vacancieActive;
    // console.log(vacancieActive):
    const handleInfo=(e)=>{
        setCandiadteInfo({
            ...candidateInfo,
            [e.target.name]:e.target.value,
        });
        if(e.target.value===''){
            setError(true);
            return;
        }
    }
    const handleFile=(e)=>{
        setFile(e.target.files[0])
    }
    const handleSubmit=async(e)=>{
        e.preventDefault();
        if(candidateInfo.name === '' || candidateInfo.email === '' ){
            Swal.fire('Error','Error, todos los campos son obligatorios','error');
            return;
        }
        if(file==='' || file.type!=='application/pdf'){
            Swal.fire('Error','Adjunta tu cv en un formato valido (PDF)','error');
            return;
        }
        if(socialService || profesionalPractice){
            if(candidateInfo.semester === '' || candidateInfo.institute === '' ){
                Swal.fire('Error','Error, todos los campos son obligatorios','error');
                return;
            }
        }
        if(candidateInfo.semester<7 || candidateInfo.semester>10){
            Swal.fire('Error','Error, los semestres permitidos son 7,8,9 o 10','error');
            return;
        }
        dispatch(uploadCV(url,candidateInfo,file));
        history.push('/');
    }
    const handleReport=async(e)=>{
        e.preventDefault();
        Swal.fire({
            title: '¿Enviar reporte?',
            text: "Esta seguro que de enviar de que desea enviar un reporte de esta vacante",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, enviar!',
            cancelButtonText: 'No,cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(startReportVacancie(url,formReportValues.email,formReportValues.reason));
                resetReport();
                history.replace('/');
            }
        })
    }
    if(loading){
        return(
            <Spinner/>
        )
    }
    return (
        <>
            <h1 className="text-center pt-5">{title}</h1>
            <div className="vacancie container-vacancie upper-content">
                <div className="box">
                    <p className="tag">Empresa</p>
                    <p className="company">{company}</p>
                </div>
                <div className="box">
                    <p className="tag">Contrato</p>
                    <p className="contract">{contract}</p>
                </div>
                <div className="box">
                    <p className="tag">Salario</p>
                    <p className="salary">{salary}USD</p>
                </div>
            </div>
            <div className="row">
            <div className="col-md-5 box px-5">
                    <p className="tag">Descripción</p>
                    <p className="description" dangerouslySetInnerHTML={{__html:description}}></p>
                </div>
                <div className="col-md-7 box">
                    <p className="tag">Ubicacion</p>
                    <p>{!location?'':location[2]}</p>
                </div>
            </div>
            <div className="vacancie container-vacancie row">
                <div className="col-md-1"></div>
                <div className="col-md-8">
                    <MapView location={location}/>
                </div>
                <div className="col-md-2"></div>
            </div>
            <div className="vacancie container-vacancie ">
                <div className="box">
                    <p className="tag">Conocimientos deseados:</p>
                    <ul className="skills">
                        {
                            (!skills)?'':
                            (
                                skills.map((skill,index)=>(
                                    <Skill key={index} skill={skill}/>
                                ))
                            )
                        }
                    </ul>
                </div>
            </div>
            <div className="container-vacancie data-recruiter">
                <div className="row">
                    <div className="col-md-8">
                        <h2 className="text-center pt-5">Contactar Reclutador</h2>
                        <p className="pt-5">Llena el siguiente formulario, sube tu curriculum y pronto te contactaremos</p>
                        <form onSubmit={handleSubmit} className="default-form ">
                            <div className="row">
                                <div className="field col-9">
                                    <label >Nombre:</label>
                                    <input type="text" name="name" placeholder="Nombre" onChange={handleInfo} className={(error && candidateInfo.name=== '')?'error':''}/>
                                </div>
                                {(error && candidateInfo.name==='')&& <Alert field={'nombre'}/>}
                            </div>
                            
                            <div className="row">
                                <div className="field col-9">
                                    <label >Correo:</label>
                                    <input type="text" name="email" placeholder="Email" onChange={handleInfo} className={`${(error && candidateInfo.email==='')?'error':''}`}/>
                                </div>
                                {(error && candidateInfo.email==='')&& <Alert field={'email'}/>}
                            </div>
                            {(socialService || profesionalPractice)?
                                (
                                    <>
                                        <div className="row">
                                            <div className="field col-9">
                                                <label >Institution Educativa:</label>
                                                <input type="text" name="institute" placeholder="Ej:ESIME,ESCOM" onChange={handleInfo}  className={`${(error && candidateInfo.institute==='')?'error':''}`}/>
                                            </div>
                                            {(error && candidateInfo.institute==='')&& <Alert field={'Instituto'}/>}
                                        </div>
                                        <div className="row">
                                            <div className="field col-9">
                                                <label >Semestre cursado:</label>
                                                <input type="number" name="semester" placeholder="7,8,9" onChange={handleInfo} className={`${(error && candidateInfo.semester==='')?'error':''}`}/>
                                            </div>
                                            {(error && candidateInfo.semester==='')&& <Alert field={'Semestre'}/>}
                                        </div>
                                    </>
                                ):''
                            }
                            <div className="row">
                                <div className="field col-9">
                                    <label >CV(PDF):</label>
                                    <input type="file" name="cv" onChange={handleFile} className="form-control form-control-sm"/>
                                </div>
                            </div>
                            <div className="field row">
                                <input type="submit" className="btn btn-success btn-f-size__15 btn-f-weight__bold col-6" value="Enviar CV"/>
                            </div>
                        </form>
                    </div>
                    {
                        author&&(
                            <div className="info-recruiter col-md-3">
                                <h2 className="mb-3">Reclutador</h2>
                                {(author.name)?
                                    <p className="mb-4">{author.name}</p>:''
                                }
                                {(author.image)?
                                    <img src={`${process.env.REACT_APP_RESOURCES}/profiles/${author.image}`} alt="imagen-recuiter"/>:''
                                    }
                            </div>
                        )
                    }
                </div>
            </div>
            <div className="container-vacancie data-recruiter">
                <div className="row">
                    <div className="col-md-12">
                        <h2 className="text-center pt-5">Reportar vacante</h2>
                        <p className="pt-5">Llena el siguiente formulario para reportar esta vacante</p>
                        <form onSubmit={handleReport} className="default-form ">
                            <div className="row">
                                <div className="field col-9">
                                    <label >Correo:</label>
                                    <input type="text" name="email" placeholder="Email" onChange={handleReportInputChange} />
                                </div>
                            </div>
                            <div className="field">
                                <label >Razón:</label>
                                <textarea type="text" name="reason" placeholder="Razon del reporte" onChange={handleReportInputChange} rows="10"></textarea>
                            </div>
                            
                            <div className="field row">
                                <input type="submit" className="btn btn-warning btn-f-size__15 btn-f-weight__bold col-6" value="Enviar reporte" disabled={(formReportValues.email==='' || formReportValues.reason==='')?true:false}/>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}
