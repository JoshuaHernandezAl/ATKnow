import React from 'react'
import { Vacancie } from './Vacancie'

export const Vacancies = ({vacancies=[]}) => {
    //console.log(vacancies);
    return (
        <div className="pt-3">
            {
                vacancies.map(vacancie=>{
                    return <Vacancie key={vacancie._id} {...vacancie}/>
                })
            }
        </div>
    )
}
