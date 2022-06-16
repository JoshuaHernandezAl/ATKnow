import React from 'react'
import { Link } from 'react-router-dom'

export const OptionsNavSecondary = () => {
    return (
        <div className="mb-3 mt-3 px-4 py-3 d-flex justify-content-around">
            <Link 
                className="btn btn-outline-success fs-2 text-center" 
                to="/home/create-vacancie"
            >
                Publicar Vacante
            </Link>
            <Link 
                className="btn btn-outline-light fs-2 text-center" 
                to="/premium-vacancies"
            >
                Las mejores vacantes
            </Link>
        </div>
    )
}
