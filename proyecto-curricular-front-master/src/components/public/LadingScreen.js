import React,{useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { vacanciesLoadingLast } from "../../actions/vacancies";
import { OptionsNav } from '../ui/OptionsNav';
import { Search } from '../ui/Search';
import { Spinner } from '../ui/Spinner';
import { VacanciePremium } from '../vacancies/VacanciePremium';
import { Vacancies } from '../vacancies/Vacancies';
import './styles.css';
export const LadingScreen = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(vacanciesLoadingLast())
    }, [dispatch]);
    const {vacancies=[],loading} = useSelector(state => state.vacancies);
    if(loading){
        return(
            <Spinner/>
        )
    }
    if(vacancies.length ===0){
        return (
            <div>
                <OptionsNav/>
                <h2 className="text-center pt-5">No hay vacantes</h2>
            </div>
        )
    }
    return (
        <div className="container mt-2">
            <h3 className="text-center pt-5">Encuentra trabajo como desarrollador</h3>
            <OptionsNav/>
            <VacanciePremium/>
            <Search/>
            <h2 className="pt-5">Últimas vacantes</h2>
            <Vacancies vacancies={vacancies}/>
        </div>
    )
}
