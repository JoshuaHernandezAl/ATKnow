import React from 'react'
import { VacancieHome } from './VacancieHome'

export const VacanciesHome = ({vacancies=[]}) => {
    // console.log(vacancies);
    return (
        <div className="pt-3">
            {
                vacancies.map(vacancie=>{
                    return <VacancieHome key={vacancie._id} {...vacancie}/>
                })
            }
        </div>
    )
}
