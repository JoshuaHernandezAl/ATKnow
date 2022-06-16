import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { profesionalPracticeLoading } from '../../actions/social-service';
import { OptionsNavSecondary } from '../ui/OptionsNavSecondary';
import { Pagination } from '../ui/Pagination';
import { Spinner } from '../ui/Spinner';
import { VacanciePremium } from '../vacancies/VacanciePremium';
import { Vacancies } from '../vacancies/Vacancies';

export const ProfesionalPracticeScreen = () => {
    const [range, setRange] = useState({
        from:0,
        limit:5
    });
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(profesionalPracticeLoading(range.from,range.limit));
    }, [dispatch,range]);
    const {vacancies=[],loading,vacanciesNext} = useSelector(state => state.vacancies);
    if(loading){
        return(
            <Spinner/>
        )
    }
    if(vacancies.length ===0){
        return (
            <div>
                <OptionsNavSecondary/>
                <h2 className="text-center pt-5">No hay mas vacantes</h2>
            </div>
        )
    }
    return (
        <div className="container mt-2">
            <h3 className="text-center pt-5">Encuentra donde hacer tus prácticas profesionales</h3>
            <OptionsNavSecondary/>
            <VacanciePremium/>
            <Vacancies vacancies={vacancies}/>
            <Pagination  range={range} setRange={setRange} next={vacanciesNext}/>
        </div>
    )
}
