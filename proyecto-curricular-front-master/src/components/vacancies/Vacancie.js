import React from 'react';
import { Link } from 'react-router-dom';
import "./styles.css";
export const Vacancie = (props) => {
    // console.log(props);
    const {company,contract,salary,title,location,premium}=props;
    //console.log(author,title);
    return (
        <>
            <div className="vacancie">
                <div className="box">
                    <h3 className="position">{company}:</h3>
                    <p className="name">{title}</p>
                    <p className="tag">Ubicación:</p>
                    <p className="name">{location[2] || location.dir}</p>
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
                        className={`btn ${(premium)?'btn-outline-warning':'btn-success'} btn-f-size__15 btn-f-weight__bold`} 
                        to={`/vacancie-detail/${props.url}`}
                    >
                        Mas información
                        {
                            (premium && <i className="far fa-star fa-1x px-3"></i>)
                        }
                    </Link>
                </div>
            </div>
        </>
    )
}
