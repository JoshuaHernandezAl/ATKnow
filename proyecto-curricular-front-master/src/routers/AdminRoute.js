import React from 'react'
import {Route,Redirect} from 'react-router-dom';
import PropTypes from 'prop-types'


export const AdminRoute = ({
    role,
    component:Component,
    ...rest
}) => {
    return (
        <Route {...rest}
            component={(props)=>(
                (role==="ADMIN_ROLE")?(<Component {...props}/>)
                :(<Redirect to="/restricted/login" />)
            )} 
        />
    )
}

AdminRoute.protoTypes={
    role:PropTypes.bool.isRequired,
    component:PropTypes.func.isRequired,
}