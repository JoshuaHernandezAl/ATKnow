import React from 'react';
import {Switch,Route, Redirect} from 'react-router-dom';
import { AboutUs } from '../components/public/AboutUs';
import { AllVacancies } from '../components/public/AllVacancies';
import { BestVacancies } from '../components/public/BestVacancies';
import { FirstJobScreen } from '../components/public/FirstJobScreen';
import { LadingScreen } from '../components/public/LadingScreen';
import { ProfesionalPracticeScreen } from '../components/public/ProfesionalPracticeScreen';
import { SearchVacancie } from '../components/public/SearchVacancie';
import { SearchVacanciesAdv } from '../components/public/SearchVacanciesAdv';
import { SocialServiceScreen } from '../components/public/SocialServiceScreen';
import { DetailView } from '../components/vacancies/DetailView'

export const DashboardPublicRoutes = () => {
    return (
        <>
            <div className="container mt-2">
                <Switch>
                    <Route exact path="/landing" component={LadingScreen}/>
                    <Route exact path="/first-jobs" component={FirstJobScreen}/>
                    <Route exact path="/social-service" component={SocialServiceScreen}/>
                    <Route exact path="/profesional-practice" component={ProfesionalPracticeScreen}/>
                    <Route exact path="/vacancie-detail/:vacancieUrl" component={DetailView} /> 
                    <Route exact path="/all-vacancies" component={AllVacancies} /> 
                    <Route exact path="/premium-vacancies" component={BestVacancies} /> 
                    <Route exact path="/search/:query" component={SearchVacancie} /> 
                    <Route exact path="/search-advance" component={SearchVacanciesAdv} /> 
                    <Route exact path="/about-us" component={AboutUs} /> 
                    <Redirect to="/landing"/>
                </Switch>
            </div>
        </>
    )
}
