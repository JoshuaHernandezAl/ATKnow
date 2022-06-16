import React,{useEffect, useState} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { vacanciesBestLoading } from '../../actions/vacancies';
import { Spinner } from '../ui/Spinner';
import { Vacancies } from "../vacancies/Vacancies";
import './tabs.css';

export const BestVacancies = () => {
    const [toggleState, setToggleState] = useState(Number(localStorage.getItem('tab'))||1);
    const dispatch = useDispatch();
    useEffect(() => {
        if(toggleState===1){
            dispatch(vacanciesBestLoading());
        }else{
            dispatch(vacanciesBestLoading(true));
        }
        localStorage.setItem('tab',toggleState);
    }, [dispatch,toggleState])
    const toggleTab = (index) => {
        setToggleState(index);
    };
    const {vacancies=[],loading} = useSelector(state => state.vacancies);
    // console.log(vacancies);
    return (
        <div className="tab-container">
            <div className="bloc-tabs">
                <button
                className={toggleState === 1 ? "tabs active-tabs" : "tabs"}
                onClick={() => toggleTab(1)}
                >
                    Mejores vacantes 
                </button>
                <button
                className={toggleState === 2 ? "tabs active-tabs" : "tabs"}
                onClick={() => toggleTab(2)}
                >
                    Nuestras recomendaciones
                </button>
            </div>

            <div className="content-tabs">
                <div
                className={toggleState === 1 ? "content  active-content" : "content"}
                >
                    {
                        (loading)?(
                            <Spinner/>
                        ):(
                            <>
                                <Vacancies vacancies={vacancies}/>
                            </>
                        )
                    }
                </div>

                <div
                className={toggleState === 2 ? "content  active-content" : "content"}
                >
                    {
                        (loading)?(
                            <Spinner/>
                        ):(
                            <>
                                <Vacancies vacancies={vacancies}/>
                            </>
                        )
                    }
                </div>
        </div>
    </div>
    )
}
