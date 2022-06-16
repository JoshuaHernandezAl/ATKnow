import React from 'react'

export const Alert = ({field}) => {
    return (
        <div className="col-3 alert alert-danger">
            El {field} es obligatorio
        </div>
    )
}
