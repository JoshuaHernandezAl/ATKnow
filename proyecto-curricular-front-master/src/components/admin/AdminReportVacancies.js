import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { vacanciesReportedLoading } from '../../actions/admin';
import { AdminOptions } from '../ui/AdminUI/AdminOptions';
import { Pagination } from '../ui/Pagination';
import { Spinner } from '../ui/Spinner';
import { ReportedVacancies } from './AdminVacancies/ReportedVacancies';

export const AdminReportVacancies = () => {
    const dispatch = useDispatch();
    const [range, setRange] = useState({
        from:0,
        limit:5
    });
    useEffect(() => {
        dispatch(vacanciesReportedLoading(range.from,range.limit))
    }, [dispatch,range]);
    const {vacanciesReports=[],loading,reportsNext} = useSelector(state => state.admin);
    if(loading){
        return(
            <Spinner/>
        )
    }
    if(vacanciesReports.length ===0){
        return (
            <div>
                <AdminOptions/>
                <h2 className="text-center pt-5">No hay vacantes reportadas, puede revisar por las solicitudes de ATKnow Académico</h2>
            </div>
        )
    }
    return (
        <div className="container mt-2">
            <h1 className="text-center m-5 pt-3">Adminstración</h1>
            <AdminOptions/>
            <h2 className="pt-5">Últimas vacantes reportadas</h2>
            <ReportedVacancies vacanciesReports={vacanciesReports}/>
            <Pagination  range={range} setRange={setRange} next={reportsNext}/>
        </div>
    )
}
