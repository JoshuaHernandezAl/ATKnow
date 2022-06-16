import { types } from "../types/types";

const initialState={
    loading: true,
    vacancies:[],
    vacancieActive:{},
    vacanciePremiumRandom:[],
    vacanciesNext:false,
}
export const vacanicesReducer=(state=initialState,action) => {
    switch (action.type) {
        case types.vacanciesLoaded:
            return {
                ...state,
                vacancies:[...action.payload]
            }
        case types.vacanciesNextLoading:
            return {
                ...state,
                vacanciesNext:action.payload,
            }
        case types.vancieLoaded:
            return {
                ...state,
                vacancieActive:{...action.payload}
            }
        case types.vacanciePremiumLoaded:
            return {
                ...state,
                vacanciePremiumRandom:action.payload,
            }
        case types.dataLoaded:
            return {
                ...state,
                loading:false,
            }
            case types.vacancieDataChart:
                return {
                    ...state,
                    ...action.payload,
                }  
        default:
            return state;
    }
}