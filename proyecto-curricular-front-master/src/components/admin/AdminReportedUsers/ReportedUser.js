import React from 'react'
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { deleteReportedUser } from '../../../actions/admin';

export const ReportedUser = (props) => {
    const {email,name, reportedVacancies,uid,totalCandidates}=props
    const history = useHistory();
    const dispatch = useDispatch();
    const handleDeleteUser=(e) => {
        e.preventDefault();
        Swal.fire({
            title: '¿Seguro que desea eliminar al usuario?',
            text: "Recuerda que es necesario que revises la informacion del usuario previo a decidir.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Eliminar',
            cancelButtonText:'Cancelar'
        }).then((result) => {
        if (result.isConfirmed) {
            dispatch(deleteReportedUser(uid));
            history.push('/admin/admin-reported-users');
        }
        })
    }
    return (
        <>
        <div className="vacancie">
            <div className="box">
                <h3 className="position">{name}:</h3>
                <p className="name">{email}</p>
                <p className="tag">Vacantes reportadas:</p>
                <p className="name">{reportedVacancies}</p>
            </div>
            <div className="box">
                <h3 className="tag">Número de candidatos:</h3>
                <p className="name">{totalCandidates}</p>
            </div>
            <div className="box vertical-center mx=5">
                <Link 
                    className="btn btn-outline-primary btn-f-size__15 btn-f-weight__bold"
                    to={`/admin/admin-reported-user/${uid}`}
                >
                    Mas información
                </Link>
                <button 
                    className="btn btn-outline-danger btn-f-size__15 btn-f-weight__bold mx-4"
                    onClick={handleDeleteUser}
                >
                    Eliminar usuario
                </button>
            </div>  
        </div>
    </>
    )
}
