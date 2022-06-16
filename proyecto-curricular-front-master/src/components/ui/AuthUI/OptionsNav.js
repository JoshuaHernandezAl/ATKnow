import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

export const OptionsNav = () => {
    const {role} = useSelector(state => state.auth);
    return (
        <div className="mb-3 mt-3 px-4 py-3 d-flex justify-content-around">
            <Link 
                className="btn btn-outline-success fs-2 text-center" 
                to="/home/create-vacancie"
            >
                Publicar Vacante
            </Link>
            {(role==='ADMIN_ROLE')&&
                <Link 
                className="btn btn-outline-info fs-2 text-center px-5" 
                to="/admin"
                >
                    Administración
                </Link>
            }
        </div>
    )
}
