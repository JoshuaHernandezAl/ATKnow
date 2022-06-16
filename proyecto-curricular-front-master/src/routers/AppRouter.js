import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    BrowserRouter as Router,
    Switch,
} from "react-router-dom";
import { startChecking } from '../actions/auth';
import Navbar  from '../components/ui/Navbar';
import { Spinner } from '../components/ui/Spinner';
import { AdminRoute } from './AdminRoute';
import { AllPublicRoutes } from './AllPublicRoutes';
import { DashboardAdminRoutes } from './DashboardAdminRoutes';
import { DashboardPublicRoutes } from './DashboardPublicRoutes';
import { DashboardRetrictecPublicRoutes } from './DashboardRetrictecPublicRoutes';
import { DashboardRoutes } from './DashboardRoutes';
import { PrivateRoute } from './PrivateRoute';
import { PublicRoute } from './PublicRoute';

export const AppRouter = () => {
    const dispatch = useDispatch();
    const {checking,uid,role} = useSelector(state => state.auth)
    useEffect(() => {
        dispatch(startChecking());
    }, [dispatch])
    if(checking) {
        return (<Spinner/>)
    }
    return (
        <>
            <Router>
                <Navbar/>
                <div>
                    <Switch>
                        <PublicRoute path="/restricted" component={DashboardRetrictecPublicRoutes} isLoggedIn={!!uid}/>
                        <PrivateRoute path="/home" component={DashboardRoutes} isLoggedIn={!!uid}/>
                        <AdminRoute path="/admin" component={DashboardAdminRoutes} role={role}/>
                        <AllPublicRoutes path="/" component={DashboardPublicRoutes} />
                    </Switch>
                </div>
            </Router>
        </>
    )
}