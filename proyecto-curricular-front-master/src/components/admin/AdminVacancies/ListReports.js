import React from 'react'

export const ListReports = ({report}) => {
    const {email,reason} = report;
    return (
        <div className="border border-secondary rounded-3 my-4 py-3 px-5 d-flex justify-content-evenly">
            <div>
                <h3 className="tag">Reporte de:</h3>
                <p className="name">{email}</p>
            </div>
            <div>
                <h4 className="tag">Razón del reporte:</h4>
                <p className="name">{reason}</p>
            </div>
        </div>
    )
}
