import { types } from "../types/types";

const initialState={
    loading: true,
    activeReport:{},
    reportsNext:false,

    atKnowRequests:[],
    vacanciesReports:[],
    usersReports:[],
}

export const adminReducer=(state=initialState,action) => {
    switch (action.type) {
        case types.adminNextReports:
            return {
                ...state,
                reportsNext:action.payload,
            }
        case types.adminDataLoaded:
            return {
                ...state,
                loading:false,
            }
        case types.adminReportLoaded:
            return {
                ...state,
                activeReport:{...action.payload}
            }

        case types.adminUsersReports:
            return {
                ...state,
                usersReports:[...action.payload]
            }
        case types.adminVacanciesReports:
            return {
                ...state,
                vacanciesReports:[...action.payload]
            }
        case types.adminRequests:
            return {
                ...state,
                atKnowRequests:[...action.payload]
            }
        
        default:
            return state;
    }
}