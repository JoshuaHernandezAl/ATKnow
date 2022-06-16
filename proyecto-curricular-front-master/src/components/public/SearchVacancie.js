import React, { useEffect } from 'react'
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { searchFast } from '../../actions/vacancies';
import { OptionsNavSecondary } from '../ui/OptionsNavSecondary';
import { Pagination } from '../ui/Pagination';
import { Spinner } from '../ui/Spinner';
import { VacanciePremium } from '../vacancies/VacanciePremium';
import { Vacancies } from '../vacancies/Vacancies';


export const SearchVacancie = () => {
    const {query}=useParams();
    const [range, setRange] = useState({
        from:0,
        limit:5
    });
    const dispatch = useDispatch();
    useEffect(() => {
            dispatch(searchFast(range.from,range.limit,query));
    }, [dispatch,range,query]);
    const {vacancies=[],loading,vacanciesNext} = useSelector(state => state.vacancies);
    if(loading){
        return(
            <Spinner/>
        )
    }else{
        if(vacancies.length ===0){
            return (
                <div>
                    <OptionsNavSecondary/>
                    <h2 className="text-center pt-5">No hay vacantes</h2>
                </div>
            )
        }
        return (
            <div className="container mt-2">
                <h3 className="text-center pt-5">Resultados:</h3>
                <OptionsNavSecondary/>
                <VacanciePremium/>
                <Vacancies vacancies={vacancies}/>
                <Pagination  range={range} setRange={setRange} next={vacanciesNext}/>
            </div>
        )
    }
}
