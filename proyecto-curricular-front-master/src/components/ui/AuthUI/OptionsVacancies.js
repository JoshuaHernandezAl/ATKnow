import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2';
import { deleteVacancie, supendVacancie } from "../../../actions/vacancies";


const OptionsVacancies = ({history,url}) => {
    const dispatch = useDispatch();
    const {uid} = useSelector(state => state.auth);
    const handleSuspend=()=>{
        Swal.fire({
            title: '¿Seguro que desea suspender esta vacante?',
            text: "Para revertir esto solo debe dar click en 'Activar'",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si,suspender',
            cancelButtonText:"Cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(supendVacancie(url,uid));
                history.replace('/home');
            }
        });
    }
    const handleDelete=()=>{
        Swal.fire({
            title: '¿Seguro que desea eliminar la vacante?',
            text: "Una vacante eliminada no se puede recuperar",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, eliminar!',
            cancelButtonText:"Cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(deleteVacancie(url,uid));
                history.replace('/home');
            }
        });
    }
    return (
        <div className="mb-3 mt-3 px-4 py-3 d-flex justify-content-around">
            <Link 
                className="btn btn-outline-primary fs-2 text-center" 
                to={`/home/edit-vacancie/${url}`}
            >
                Editar vacante
            </Link>
            <button 
                className="btn btn-outline-warning fs-2 text-center" 
                onClick={handleSuspend}
            >
                Suspender vacante
            </button>
            <button 
                className="btn btn-outline-danger fs-2 text-center" 
                onClick={handleDelete}
            >
                Eliminar vacante
            </button>
        </div>
    )
}
export default withRouter(OptionsVacancies);