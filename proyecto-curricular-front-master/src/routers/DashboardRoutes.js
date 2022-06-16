import React from 'react'
import {Switch,Route, Redirect} from 'react-router-dom';
import { CreateVacancie } from '../components/jobs/CreateVacancie';
import { FAQ } from '../components/jobs/FAQ';
import { HomeScreen } from '../components/jobs/HomeScreen';
import { ProfileScreen } from '../components/jobs/ProfileScreen';
import { BenefitsPayments } from '../components/payment/BenefitsPayments';
import { PaymentScreen } from '../components/payment/PaymentScreen';
import { EditVacancie } from '../components/vacancies/PrivateVacancies/EditVacancie';
import { VacancieDetail } from '../components/vacancies/PrivateVacancies/VacancieDetail';



export const DashboardRoutes = () => {
    return (
        <>
            <div className="container mt-2">
                <Switch>
                    <Route exact path="/home" component={HomeScreen} />  
                    <Route exact path="/home/profile" component={ProfileScreen} />   
                    <Route exact path="/home/create-vacancie" component={CreateVacancie} />   
                    <Route exact path="/home/vacancie-detail/:vacancieUrl" component={VacancieDetail} />   
                    <Route exact path="/home/edit-vacancie/:vacancieUrl" component={EditVacancie} />    
                    <Route exact path="/home/payment" component={PaymentScreen} />    
                    <Route exact path="/home/benefits" component={BenefitsPayments} />    
                    <Route exact path="/home/faq" component={FAQ} />    
                    <Redirect to="/home"/>
                </Switch>
            </div>
        </>
    )
}