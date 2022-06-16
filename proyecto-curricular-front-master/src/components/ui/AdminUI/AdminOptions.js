import React from 'react'
import { Link } from 'react-router-dom'

export const AdminOptions = () => {
    return (
        <div className="mb-3 mt-3 px-4 py-3 d-flex justify-content-around ">
            <Link 
                className="btn btn-outline-success fs-2 text-center" 
                to="/admin/admin-reported-vacancies"
            >
                Vacantes reportadas
            </Link>
            <Link 
                className="btn btn-outline-primary fs-2 text-center" 
                to="/admin/admin-reported-users"
            >
                Usuarios reportados
            </Link>
            <Link 
                className="btn btn-outline-light fs-2 text-center" 
                to="/admin/admin-academic-atknow-request"
            >
                Solicitudes a ATKnow Académico
            </Link>
        </div>
    )
}
