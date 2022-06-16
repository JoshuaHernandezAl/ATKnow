import React, { useEffect } from 'react'
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { startLoadingPremiumVacancie } from '../../actions/vacancies';
import './spinner.css'
import "./styles.css";
import { Spinner } from '../ui/Spinner';

export const VacanciePremium = () => {
    const dispatch = useDispatch();
    const {vacanciePremiumRandom,loading} = useSelector(state => state.vacancies);
    useEffect(() => {
        dispatch(startLoadingPremiumVacancie())
    }, [dispatch]);
    // console.log(vacanciePremiumRandom[0])
    if(loading){
        return (
            <Spinner/>
        )
    }
    if(vacanciePremiumRandom[0]){
        const {company,contract,salary,title,url}=vacanciePremiumRandom[0];
        return (
            <>
                <div className="vacancie border border-secondary rounded-3 m-3 px-5 flex-column ">
                    <div className="box">
                        <h3 className="text-center text-uppercase fw-bold">¡Échale un ojo!</h3>
                    </div>
                    <div className="row">
                        <div className="box">
                            <h3 className="position">{company}:</h3>
                            <p className="name">{title}</p>
                        </div>
                        <div className="box">
                            <p className="tag">Contrato:</p>
                            <p className="name contract">{contract}</p>
                        </div>
                        <div className="box">
                            <p className="tag">Sueldo:</p>
                            <p className="name contract">{salary}</p>
                        </div>
                        <div className="box vertical-center">
                            <Link 
                                className={`btn btn-outline-warning btn-f-size__15 btn-f-weight__bold`} 
                                to={`/vacancie-detail/${url}`}
                            >
                                Mas información
                                <i className="far fa-star fa-1x px-3"></i>
                            </Link>
                        </div>
                    </div>
                </div>
            </>
        )
    }else{
        return(
            <div className="d-flex justify-content-center">
                <h2 className="text-center vacancie border border-secondary rounded-3 m-3 px-5">No hay vacantes</h2>
            </div>
        )
    }
}
