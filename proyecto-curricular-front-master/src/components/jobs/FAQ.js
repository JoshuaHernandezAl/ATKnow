import React from 'react'
import { Link } from 'react-router-dom/cjs/react-router-dom.min'

export const FAQ = () => {
    return (
        <div>
            <h1 className="text-center pt-5 pb-3">Preguntas frecuentes</h1>
            <h3 className="my-4 fw-light">¿Cómo publicar una vacante?</h3>
            <p className="fs-3 text-start ms-5 font-monospace">Para publicar una vacante solo debe darle en publicar vacante y llenar el formulario, la plataforma publicará la vacante y que pueda ser vista por los visitantes de la página.</p>
            <h3 className="my-4 fw-light">¿Cuál es la diferencia entre suspender vacante y eliminar vacante?</h3>
            <p className="fs-3 text-start ms-5 font-monospace">Al eliminar una vacante esta será removida de la plataforma y no podrás recuperarla, mientras que suspender una vacante solo hará que tu vacante no sea pública y que nadie pueda verla más que tu.</p>
            <h3 className="my-4 fw-light">Elimine una vacante por error ¿hay oportunidad de recuperarla?</h3>
            <p className="fs-3 text-start ms-5 font-monospace">Lamentablemente si tú eliminas una vacante no hay nada que se pueda hacer, la vacante y toda la información relacionada a ella se pierde una vez que se elimina.</p>
            <h3 className="my-4 fw-light">¿Qué significa ATKnow académico?</h3>
            <p className="fs-3 text-start ms-5 font-monospace">Ser parte de ATKnow académico te permite crear vacantes de tipo “servicio social” y “prácticas profesionales” por lo que puedes llegar a más candidatos interesados en tu empresa.</p>
            <h3 className="my-4 fw-light">¿Qué beneficios tiene ser premium y cuales son los precios de este servicio?</h3>
            <p className="fs-3 text-start ms-5 font-monospace">Para ingresar a esta información te recomendamos que des click <Link to="/home/benefits">aquí</Link> para llevarte a los beneficios de ser un usuario premium de ATKnow.
            Lo precios de ser usuario premium varían entre $5 a $38 USD</p>

        </div>
    )
}
