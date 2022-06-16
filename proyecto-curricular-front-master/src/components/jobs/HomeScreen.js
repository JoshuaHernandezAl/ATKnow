import React from 'react'
import { useSelector } from 'react-redux'
import { DashboardVacancies } from '../ui/AuthUI/DashboardVacancies';
import { OptionsNav } from '../ui/AuthUI/OptionsNav';
import { Spinner } from '../ui/Spinner';
import { VacanciesHome } from '../vacancies/PrivateVacancies/VacanciesHome';


export const HomeScreen = () => {
    const {vacancies,checking} = useSelector(state => state.auth);
    if(checking) {
        return (<Spinner/>)
    }
    return (
        <div className="pt-4 container">
            <DashboardVacancies/>
            <OptionsNav/>
            <h1 className="m-5 pt-3 text-center">Mis vacantes:</h1>
            {
                (vacancies.length > 0)?<VacanciesHome vacancies={vacancies}/>:<h3 className="mx-5 text-center">Aún no tienes ninguna vacante, crea una</h3>

            }
            
        </div>
    )
}
