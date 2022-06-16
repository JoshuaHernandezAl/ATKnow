import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { useHistory, useParams } from 'react-router-dom/cjs/react-router-dom.min';
import Swal from 'sweetalert2';
import { activeReportedVacancie, deleteReportedVacancie, vacancieReportLoading } from '../../../actions/admin';
import { Spinner } from '../../ui/Spinner';
import { ListReports } from './ListReports';

export const DetailReportVacancie = () => {
    const {vacancieId}=useParams();
    const dispatch = useDispatch();
    const history = useHistory();
    const {activeReport,loading} = useSelector(state => state.admin);
    const activeReportRef=useRef(activeReport);
    useEffect(() => {
        dispatch(vacancieReportLoading(vacancieId))
        if(Object.keys(activeReportRef.current).length===0){
            return <Redirect to='/admin'/>
        }
    }, [dispatch,vacancieId]);
    useEffect(() => {
        window.scroll(0,0);
    }, []);
    const {author,candidatesNumber,reports,reportsNumber,title,_id:id,url} = activeReport;
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
            dispatch(activeReportedVacancie(id,{uid:author.uid}));
            history.push('/admin');
        }
        })
    }
    const handleDelete=(e)=>{
        e.preventDefault();
        Swal.fire({
            title: '¿Seguro que desea eliminar esta vacante?',
            text: "Recuerda que es necesario que revises los reportes de la vacante.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Eliminar',
            cancelButtonText:'Cancelar'
        }).then((result) => {
        if (result.isConfirmed) {
            dispatch(deleteReportedVacancie(url));
            history.push('/admin');
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
            <h1 className="text-center pt-5">{title}</h1>
            {
            author&&(
                <div className="vacancie container-vacancie upper-content">
                    <div className="col-md-3 box">
                        {(author.name)?
                            <div className="d-flex justify-content-evenly">
                                <h2 className="mb-3 tag">Publicacion de:</h2>
                                <p className="mb-4 fw-bold fs-2 name">{author?.name}</p>
                                <p className="mb-4 fw-bold fs-1 name">{author?.email}</p>
                            </div>:''
                        }
                        {(author.image)?
                            <img src={`${process.env.REACT_APP_RESOURCES}/profiles/${author?.image}`} alt="imagen-recuiter"/>:''
                            }
                    </div>
                </div>
                )
            }
            <div className="vacancie container-vacancie upper-content">
                <div className="box">
                    <p className="tag mx-5">Numero de reportes:</p>
                    <p className="name mx-5">{reportsNumber}</p>
                </div>
                <div className="box">
                    <p className="tag mx-5">Numero de candidatos:</p>
                    <p className="name mx-5">{candidatesNumber}</p>
                </div>
            </div>
            <div className="vacancie container-vacancie upper-content">
                <div className="box">
                    <p className="tag mx-5">Reportes:</p>
                    <ul className="skills mx-5">
                        {
                            (!reports)?'':
                            (
                                reports.map((report,index)=>(
                                    <ListReports key={index} report={report}/>
                                ))
                            )
                        }
                    </ul>
                </div>
            </div>
            <div className="vacancie container-vacancie upper-content">
                <div className="box mx-5 px-5 d-flex justify-content-end">
                    {/* //TODO: incrementar el numero de reportes para prod */}
                    {(author?.reportedVacancies>2)?
                        <Link 
                            className="btn btn-outline-primary fs-1 btn-f-weight__bold mx-4"
                            to={`/admin/admin-reported-user/${author?.uid}`}
                        >
                            Ver usuario reportado
                        </Link>
                    :''}
                    <button 
                        className="btn btn-outline-warning fs-1 btn-f-weight__bold mx-4"
                        onClick={handleReactive}
                    >
                        Reactivar
                    </button>
                    <button 
                        className="btn btn-outline-danger fs-1 btn-f-weight__bold mx-4"
                        onClick={handleDelete}
                    >
                        Eliminar
                    </button>
                </div>
            </div>
        </>
    )
}
