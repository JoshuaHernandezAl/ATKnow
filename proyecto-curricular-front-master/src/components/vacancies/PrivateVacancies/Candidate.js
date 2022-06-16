import React from 'react';
import '../styles.css';

export const Candidate = ({candidate}) => {
    const {name,email,cv}=candidate;
    return (
        <>
            <h3>Información candidato</h3>
            <div className="vacancie container-vacancie ">
                <div className="box">
                    <p className="tag">Nombre:</p>
                    <p className="name">{name}</p>
                </div>
                <div className="box">
                    <p className="tag">Email:</p>
                    <p className="name">{email}</p>
                </div>
                <div className="box">
                    <p className="tag">CV:</p>
                    <a href={`${process.env.REACT_APP_RESOURCES}/cv/${cv}`} className="btn btn-outline-primary fs-2" target="_blank" rel="noreferrer">Ver CV</a>
                </div>
            </div>
        </>
    )
}
