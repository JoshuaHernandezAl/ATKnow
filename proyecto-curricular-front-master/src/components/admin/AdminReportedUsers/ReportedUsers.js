import React from 'react'
import { ReportedUser } from './ReportedUser'

export const ReportedUsers = ({usersReports}) => {
    return (
        <div className="pt-3">
            {
                usersReports.map(user=>{
                    return <ReportedUser key={user.uid} {...user}/>
                })
            }
        </div>
    )
}
