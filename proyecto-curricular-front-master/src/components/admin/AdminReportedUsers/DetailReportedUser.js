import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { useHistory, useParams } from 'react-router-dom/cjs/react-router-dom.min';
import Swal from 'sweetalert2';
import { deleteReportedUser, userReportLoading} from '../../../actions/admin';
import { Spinner } from '../../ui/Spinner';
import { ListVacanciesReport } from './ListVacanciesReport';

export const DetailReportedUser = () => {
    const {uid}=useParams();
    const dispatch = useDispatch();
    const history = useHistory();
    const {activeReport,loading} = useSelector(state => state.admin);
    const activeReportRef=useRef(activeReport);
    useEffect(() => {
        dispatch(userReportLoading(uid));
        if(Object.keys(activeReportRef.current).length===0){
            return <Redirect to='/admin'/>
        }
    }, [dispatch,uid]);
    useEffect(() => {
        window.scroll(0,0);
    }, []);
    const {userReported,vacanciesReported} = activeReport;
    const handleDeleteUser=(e)=>{
        e.preventDefault();
        Swal.fire({
            title: '¿Seguro que desea eliminar la cuenta del usuario?',
            text: "Recuerda que es necesario que revises los reportes del usuario antes de eliminarlo",
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
    if(loading){
        return(
            <Spinner/>
            )
    }
    return (
        <>
            <div className="d-flex justify-content-evenly">
                <h1 className="text-center pt-5">{userReported?.name}</h1>
                {(userReported?.image)?
                    <img src={`${process.env.REACT_APP_RESOURCES}/profiles/${userReported?.image}`} alt="imagen-recuiter"/>:''
                }
            </div>
            {
            userReported&&(
                <div className="vacancie container-vacancie upper-content">
                    <div className="col-md-3 box">
                        {(userReported.name)?
                            <div className="d-flex justify-content-evenly">
                                <h2 className="mb-3 tag">Correo electrónico:</h2>
                                <p className="mb-4 fw-bold fs-1 name">{userReported?.email}</p>
                            </div>:''
                        }
                        
                    </div>
                </div>
                )
            }
            <div className="vacancie container-vacancie upper-content">
                <div className="box">
                    <p className="tag mx-5">Número de reportes:</p>
                    <p className="name mx-5">{userReported?.reportedVacancies}</p>
                </div>
                <div className="box">
                    <p className="tag mx-5">Número de candidatos:</p>
                    <p className="name mx-5">{userReported?.totalCandidates}</p>
                </div>
            </div>
            <div className="vacancie container-vacancie upper-content">
                <div className="box">
                    <p className="tag mx-5">Vacantes reportadas:</p>
                    <ul className="skills mx-5">
                        {
                            (!vacanciesReported)?'':
                            (
                                vacanciesReported.map((vacancie)=>(
                                    <ListVacanciesReport key={vacancie._id} vacancie={vacancie} uid={userReported?.uid}/>
                                ))
                            )
                        }
                    </ul>
                </div>
            </div>
            <div className="vacancie container-vacancie upper-content">
                <div className="box mx-5 px-5 d-flex justify-content-end">
                    <button 
                        className="btn btn-outline-danger fs-1 btn-f-weight__bold mx-4"
                        onClick={handleDeleteUser}
                    >
                        Eliminar usuario
                    </button>
                </div>
            </div>
        </>
    )
}
