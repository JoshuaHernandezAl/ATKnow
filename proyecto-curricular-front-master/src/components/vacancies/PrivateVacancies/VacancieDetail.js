import React,{useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams,Redirect } from 'react-router';
import {vacancieLoading } from '../../../actions/vacancies';
import OptionsVacancies from '../../ui/AuthUI/OptionsVacancies';
import { MapView } from '../../ui/MapView';
import { Spinner } from '../../ui/Spinner';
import { Skill } from '../Skill';
import '../styles.css';
import { Candidates } from './Candidates';
import './styles.css';

export const VacancieDetail = ({history}) => {
    const {vacancieUrl}=useParams();
    const dispatch = useDispatch();
    const {vacancieActive,loading} = useSelector(state => state.vacancies);
    const {company,location,contract,salary,description,skills,title,author,url,candidatesNumber} = vacancieActive;
    // console.log('aqui');
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
    
    if(loading){
        return(
            <Spinner/>
        )
    }
    // console.log(locationRef.current);
    return (
        <>
            <h1 className="text-center pt-5">{title}</h1>
            <OptionsVacancies url={url}/>
            <div className="vacancie container-vacancie upper-content">
                <div className="box">
                    <p className="tag">Empresa</p>
                    <p className="name">{company}</p>
                </div>
                <div className="box">
                    <p className="tag">Contrato</p>
                    <p className="name">{contract}</p>
                </div>
                <div className="box">
                    <p className="tag">Salario</p>
                    <p className="name">{salary}</p>
                </div>
            </div>
            <div className="vacancie container-vacancie ">
                <div className="box px-5">
                    <p className="tag">Descripción</p>
                    <p className="name" dangerouslySetInnerHTML={{__html:description}}></p>
                </div>
                <div className="box">
                    <p className="tag">Ubicación</p>
                    <p className="name">{!location?'':location[2]}</p>
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
                {
                    author&&(
                        <div className="info-recruiter col-md-3 box">
                            <h2 className="mb-3">Reclutador</h2>
                            {(author.name)?
                                <p className="mb-4 fw-bold fs-3">{author.name}</p>:''
                            }
                            {(author.image)?
                                <img src={`${process.env.REACT_APP_RESOURCES}/profiles/${author.image}`} alt="imagen-recuiter"/>:''
                                }
                        </div>
                    )
                }
            </div>
            <div className="vacancie container-vacancie upper-content">
                <div className="box">
                    <p className="tag">Hay {candidatesNumber} candidato(s) para esta vacante:</p>
                    <Candidates />
                </div>
            </div>
        </>
    )
}
