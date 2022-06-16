import React from 'react'
import { Link } from 'react-router-dom'

export const BenefitsPayments = () => {
    return (
        <div className="container">
            <h1 className="text-center mt-5"> <i className="far fa-star fa-1x px-3"></i>Beneficios de ser premium<i className="far fa-star fa-1x px-3"></i></h1>
            <div className="container mt-5 p-auto">
                <ul class="list-group">
                    <li class="list-group-item d-flex justify-content-between align-items-center list-group-item-dark">
                        Tus vacantes serán mostradas en nuestra sección "Échale un ojo"
                        <span class="badge bg-primary rounded-pill"><i className="far fa-star fa-1x px-3"></i></span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center list-group-item-dark">
                        Tus vacantes apareceran dentro de nuestras recomendaciones en "Las mejores vacantes"
                        <span class="badge bg-primary rounded-pill"><i className="far fa-star fa-1x px-3"></i></span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center list-group-item-dark">
                        Tus vacantes seran listadas primero en las búsquedas
                        <span class="badge bg-primary rounded-pill"><i className="far fa-star fa-1x px-3"></i></span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center list-group-item-dark">
                        Tus vacantes creadas mientras seas premium se quedarán como premium 
                        <span class="badge bg-primary rounded-pill"><i className="far fa-star fa-1x px-3"></i></span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center list-group-item-dark">
                        Tendrás preferencia al momento de revisar los reportes que puedan ser hechos a tu vacante 
                        <span class="badge bg-primary rounded-pill"><i className="far fa-star fa-1x px-3"></i></span>
                    </li>
                </ul>
                <Link 
                    className="none pt-5 container" 
                    to="/home/payment"
                >
                    <p className="link_ls fs-3">Regresar al formulario de pago</p>
                </Link>
            </div>
        </div>
    )
}
