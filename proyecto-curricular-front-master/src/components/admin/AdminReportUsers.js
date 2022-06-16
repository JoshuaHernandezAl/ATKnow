import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { usersReportedLoading } from '../../actions/admin';
import { AdminOptions } from '../ui/AdminUI/AdminOptions';
import { Pagination } from '../ui/Pagination';
import { Spinner } from '../ui/Spinner';
import { ReportedUsers } from './AdminReportedUsers/ReportedUsers';

export const AdminReportUsers = () => {
    const dispatch = useDispatch();
    const [range, setRange] = useState({
        from:0,
        limit:5
    });
    useEffect(() => {
        dispatch(usersReportedLoading(range.from,range.limit))
    }, [dispatch,range]);
    const {usersReports=[],loading,reportsNext} = useSelector(state => state.admin);
    if(loading){
        return(
            <Spinner/>
        )
    }
    if(usersReports.length ===0){
        return (
            <div>
                <AdminOptions/>
                <h2 className="text-center pt-5">No hay usuarios reportados.</h2>
                <p className="text-center pt-5 mt-2 fs-1"> Puede revisar por las solicitudes de ATKnow Académico o por vacantes reportadas</p>
            </div>
        )
    }
    return (
        <div className="container mt-2">
            <h1 className="text-center m-5 pt-3">Adminstración</h1>
            <AdminOptions/>
            <h2 className="pt-5">Últimas vacantes reportadas</h2>
            <ReportedUsers usersReports={usersReports}/>
            <Pagination  range={range} setRange={setRange} next={reportsNext}/>
        </div>
    )
}
