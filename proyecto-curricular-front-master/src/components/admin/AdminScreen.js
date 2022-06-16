import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { vacanciesReportedLoadingLast } from '../../actions/admin';
import { AdminOptions } from '../ui/AdminUI/AdminOptions';
import { Spinner } from '../ui/Spinner';
import { ReportedVacancies } from './AdminVacancies/ReportedVacancies';

export const AdminScreen = ({history}) => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(vacanciesReportedLoadingLast())
    }, [dispatch]);
    const {vacanciesReports=[],loading} = useSelector(state => state.admin);
    if(loading){
        return(
            <Spinner/>
        )
    }
    if(vacanciesReports.length ===0){
        return (
            <div>
                <h1 className="text-center m-5 pt-3">Administración</h1>
                <AdminOptions/>
                <h2 className="text-center pt-5">No hay vacantes reportadas, puede revisar por las solicitudes de ATKnow Académico</h2>
            </div>
        )
    }
    return (
        <div className="container mt-2">
            <h1 className="text-center m-5 pt-3">Administración</h1>
            <AdminOptions/>
            <h2 className="pt-5">Últimas vacantes reportadas</h2>
            <ReportedVacancies vacanciesReports={vacanciesReports}/>
        </div>
    )
}
