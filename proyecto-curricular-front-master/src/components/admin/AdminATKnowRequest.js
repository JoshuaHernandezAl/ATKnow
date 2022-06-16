import React, { useState } from 'react'
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { atKnowRequestsLoading } from '../../actions/admin';
import { AdminOptions } from '../ui/AdminUI/AdminOptions'
import { Pagination } from '../ui/Pagination';
import { ATKnowRequests } from './AdminRequests/ATKnowRequests';
import { Spinner } from '../ui/Spinner';
import { useForm } from '../../hooks/useForm';
import Swal from 'sweetalert2';

export const AdminATKnowRequest = ({history}) => {
    const dispatch = useDispatch();
    const [range, setRange] = useState({
        from:0,
        limit:5
    });
    const [search,handleInputSearch]=useForm({
        query:'',
    })
    useEffect(() => {
        dispatch(atKnowRequestsLoading(range.from,range.limit))
    }, [dispatch,range]);
    const {atKnowRequests=[],loading,reportsNext} = useSelector(state => state.admin);
    const handleSearchRequest=(e) => {
        e.preventDefault();
        const {query}=search;
        if(query===''){
            Swal.fire('Error','Ingresa el identificador de solicitud','error')
        }
        history.push(`/admin/find-request/${query}`);
    }
    if(loading){
        return(
            <Spinner/>
        )
    }
    if(atKnowRequests.length ===0){
        return (
            <div>
                <AdminOptions/>
                <h2 className="text-center pt-5">No hay solicitudes de ATKnow Académico pendientes.</h2>
                <p className="text-center pt-5 mt-2 fs-1"> Puede revisar los reportes de usuarios o vacantes</p>
            </div>
        )
    }
    return (
            <div className="container mt-2">
                <h1 className="text-center m-5 pt-3">Administración</h1>
                <div>
                    <form className="navbar container sesion searcher nav--services" onSubmit={handleSearchRequest}>
                        <input type="text" className="searcher fs-2" name='query' placeholder="Identificador de solicitud" onChange={handleInputSearch} />
                        <button className="btn btn-primary mx-5 fs-2">Buscar</button>
                    </form>
                </div>
                <AdminOptions/>
                <h2 className="pt-5">Solicitudes de ATKnow Académico</h2>
                <ATKnowRequests atKnowRequests={atKnowRequests}/>
                <Pagination  range={range} setRange={setRange} next={reportsNext}/>
            </div>
    )
}
