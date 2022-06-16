import React from 'react'
import { Route, Switch } from 'react-router'
import { ActveAccountScreen } from '../components/auth/ActveAccountScreen'
import { LoginScreen } from '../components/auth/LoginScreen'
import { ResetPasswordConfirm } from '../components/auth/ResetPasswordConfirm'
import { ResetPasswordScreen } from '../components/auth/ResetPasswordScreen'

export const DashboardRetrictecPublicRoutes = () => {
    return (
        <>
            <div className="container mt-2">
                <Switch>
                    <Route exact path="/restricted/login" component={LoginScreen}/>
                    <Route exact path="/restricted/active-account/:token" component={ActveAccountScreen}/>
                    <Route exact path="/restricted/reset-password" component={ResetPasswordScreen}/>
                    <Route exact path="/restricted/reset-password-confirm/:token" component={ResetPasswordConfirm}/>
                </Switch>
            </div>
        </>
    )
}
