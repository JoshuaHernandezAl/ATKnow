import React from 'react'
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import Swal from 'sweetalert2';
import { atKnowAccept, atKnowChecking, atKnowReject } from '../../../actions/admin';

export const ATKnowRequest = (props) => {
    const {email,name,ssChecked,ssIdRequest}=props;
    const dispatch = useDispatch();
    const history = useHistory();
    // console.log(uid);
    const handleCheck=(e)=>{
        e.preventDefault();
        Swal.fire({
            title: '¿Esta en revisión la solicitud?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'En revision',
            cancelButtonText:'Cancelar'
        }).then((result) => {
        if (result.isConfirmed) {
            dispatch(atKnowChecking(ssIdRequest));
            history.push('/admin/admin-academic-atknow-request')
        }
        })
    }
    const handleAccept=(e)=>{
        e.preventDefault();
        Swal.fire({
            title: '¿Aceptar solicitud?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Aceptar',
            cancelButtonText:'Cancelar'
        }).then((result) => {
        if (result.isConfirmed) {
            dispatch(atKnowAccept(ssIdRequest));
            history.push('/admin/admin-academic-atknow-request')
        }
        })
    }
    const handleReject=(e)=>{
        e.preventDefault();
        Swal.fire({
            title: '¿Rechazar solicitud?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Rechazar',
            cancelButtonText:'Cancelar'
        }).then((result) => {
        if (result.isConfirmed) {
            dispatch(atKnowReject(ssIdRequest));
            history.push('/admin/admin-academic-atknow-request')
        }
        })
    }
    return (
        <>
        <div className="vacancie mx-5">
            <div className="box">
                <div  className="d-flex justify-content-start align-items-center">
                    <h3 className="position">Solicitud:</h3>
                    <p className="name mx-5">{ssIdRequest}</p>
                </div>
                <div  className="d-flex justify-content-start align-items-center">
                    <h3 className="position">De:</h3>
                    <p className="name mx-5">{name}</p>
                    <p className="name">Correo: {email}</p>
                    {(!ssChecked)?
                        <button 
                        className="btn btn-outline-warning btn-f-size__15 btn-f-weight__bold mx-5"
                        onClick={handleCheck}
                        >
                            Revisar
                        </button>
                    :
                        <div className="d-flex justify-content-evenly align-items-center">
                            <button 
                            className="btn btn-outline-success btn-f-size__15 btn-f-weight__bold ms-5"
                            onClick={handleAccept}
                            >
                                Aceptar
                            </button>
                            <button 
                            className="btn btn-outline-danger btn-f-size__15 btn-f-weight__bold ms-3"
                            onClick={handleReject}
                            >
                                Rechazar
                            </button>
                        </div>
                    }
                </div>
            </div>
        </div>
    </>
    )
}
