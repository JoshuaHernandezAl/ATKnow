import React, { useRef, useState } from 'react'
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { searchAdvanced } from '../../actions/vacancies';
import { useQuery } from '../../hooks/useQuery';
import { OptionsNavSecondary } from '../ui/OptionsNavSecondary';
import { Pagination } from '../ui/Pagination';
import { Spinner } from '../ui/Spinner';
import { VacanciePremium } from '../vacancies/VacanciePremium';
import { Vacancies } from '../vacancies/Vacancies';

export const SearchVacanciesAdv = () => {
    const queryParams=useQuery();
    const [range, setRange] = useState({
        from:0,
        limit:5
    });
    const dispatch = useDispatch();
    const data={
        state:queryParams.get('state'),
        title:queryParams.get('title'),
        city:queryParams.get('city'),
        experience:queryParams.get('experience'),
    }
    const dataRef = useRef(data)
    useEffect(() => {
        dispatch(searchAdvanced(range.from,range.limit,dataRef.current));
    }, [dispatch,range]);
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
