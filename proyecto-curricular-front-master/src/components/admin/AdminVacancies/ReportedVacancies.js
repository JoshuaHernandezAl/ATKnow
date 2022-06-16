import React from 'react'
import { ReportedVacancie } from './ReportedVacancie'

export const ReportedVacancies = ({vacanciesReports=[]}) => {
    return (
        <div className="pt-3">
            {
                vacanciesReports.map(vacancie=>{
                    return <ReportedVacancie key={vacancie._id} {...vacancie}/>
                })
            }
        </div>
    )
}
