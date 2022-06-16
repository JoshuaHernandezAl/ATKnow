import React from 'react'
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { activeVacancie } from '../../../actions/vacancies';

export const VacancieHome = (props) => {
    const dispatch = useDispatch();
    const {company,contract,salary,title,location,premium,url,candidatesNumber,available,author}=props;
    const handleActive=()=>{
        dispatch(activeVacancie(url,author));
    }
    return (
        <>
            <div className="vacancie">
                <div className="box">
                    <h3 className="position">{company}:</h3>
                    <p className="name">{title}</p>
                    <p className="tag">Ubicacion:</p>
                    <p className="name">{location[2]||location.dir}</p>
                </div>
                <div className="box px-3">
                    <p className="tag">Contrato:</p>
                    <p className="name contract">{contract}</p>
                </div>
                <div className="box">
                    <p className="tag">Sueldo:</p>
                    <p className="name contract">{salary}</p>
                </div>
                <div className="box">
                    <p className="tag">Candidatos:</p>
                    <p className="name contract">{candidatesNumber}</p>
                </div>
                <div className="box vertical-center">
                    {
                        (available)?(
                            <Link 
                                className={`btn ${(premium)?'btn-outline-warning ':'btn-primary'} btn-f-size__15 btn-f-weight__bold`} 
                                to={`/home/vacancie-detail/${url}`}
                            >
                                Ver mi vacante
                                {
                                    (premium && <i className="far fa-star fa-1x px-3"></i>)
                                }
                            </Link>
                        ):(
                            <button
                                className="btn btn-outline-light btn-f-size__15 btn-f-weight__bold"
                                onClick={handleActive}
                            >
                                Activar
                            </button>
                        )
                    }
                </div>
            </div>
        </>
    )
}
