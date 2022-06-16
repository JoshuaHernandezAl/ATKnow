import React from 'react'
import {Route,Redirect} from 'react-router-dom';
import PropTypes from 'prop-types'


export const PublicRoute = ({
    isLoggedIn,
    component:Component,
    ...rest
}) => {
    return (
        <Route {...rest}
            component={(props)=>(
                (isLoggedIn)?(<Redirect to="/home" />)
                :(<Component {...props}/>)
            )} 
        />
    )
}

PublicRoute.protoTypes={
    isLoggedIn:PropTypes.bool.isRequired,
    component:PropTypes.func.isRequired,
}