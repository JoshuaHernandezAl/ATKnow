import React from 'react'
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import Swal from 'sweetalert2';
import { activeReportedVacancie, userReportLoading } from '../../../actions/admin';

export const ListVacanciesReport = ({vacancie,uid}) => {
    const {candidatesNumber,reportsNumber,_id:id,title,reports}=vacancie;
    const dispatch = useDispatch();
    const history = useHistory();
    const handleReactive=(e)=>{
        e.preventDefault();
        Swal.fire({
            title: '¿Seguro que desea reactivar esta vacante?',
            text: "Recuerda que es necesario que revises los reportes de la vacante.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Activar',
            cancelButtonText:'Cancelar'
        }).then((result) => {
        if (result.isConfirmed) {
            dispatch(activeReportedVacancie(id,{uid}));
            dispatch(userReportLoading(uid));
            history.push(`/admin/admin-reported-user/${uid}`);
        }
        })
    }
    return (
        <>
        <div className="vacancie">
            <div className="box">
                <p className="tag">{title}</p>
                <p className="tag">Reportes:</p>
                <p className="name">{reportsNumber}</p>
            </div>
            <div className="box">
                <p className="tag">Cadidatos:</p>
                <p className="name contract">{candidatesNumber}</p>
            </div>
            <div className="box">
                <p className="tag">Último reporte:</p>
                <p className="name contract">{reports[0]?.reason||''}</p>
            </div>            
            <div className="box vertical-center mx-5">
                <Link 
                    className="btn btn-outline-primary btn-f-size__15 btn-f-weight__bold"
                    to={`/admin/admin-reported-vacancie-detail/${id}`}
                >
                    Mas información
                </Link>
                <button 
                    className="btn btn-outline-warning btn-f-size__15 btn-f-weight__bold mx-4"
                    onClick={handleReactive}
                >
                    Reactivar
                </button>
            </div>            
        </div>
    </>
    )
}
