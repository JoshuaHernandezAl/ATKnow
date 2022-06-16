import React from 'react';
import {Switch,Route, Redirect} from 'react-router-dom';
import { AdminATKnowRequest } from '../components/admin/AdminATKnowRequest';
import { DetailReportedUser } from '../components/admin/AdminReportedUsers/DetailReportedUser';
import { AdminReportUsers } from '../components/admin/AdminReportUsers';
import { AdminReportVacancies } from '../components/admin/AdminReportVacancies';
import { AdminFindRequest } from '../components/admin/AdminRequests/AdminFindRequest';
import { AdminScreen } from '../components/admin/AdminScreen';
import { DetailReportVacancie } from '../components/admin/AdminVacancies/DetailReportVacancie';


export const DashboardAdminRoutes = () => {
    return (
        <>
            <div className="container mt-2">
                <Switch>
                    <Route exact path="/admin" component={AdminScreen} /> 
                    <Route exact path="/admin/admin-reported-vacancies" component={AdminReportVacancies} /> 
                    <Route exact path="/admin/admin-reported-vacancie-detail/:vacancieId" component={DetailReportVacancie} />
                    <Route exact path="/admin/admin-reported-users" component={AdminReportUsers} /> 
                    <Route exact path="/admin/admin-reported-user/:uid" component={DetailReportedUser} /> 
                    <Route exact path="/admin/admin-academic-atknow-request" component={AdminATKnowRequest} /> 
                    <Route exact path="/admin/find-request/:query" component={AdminFindRequest} />
                    <Redirect to="/admin"/>
                </Switch>
            </div>
        </>
    )
}

