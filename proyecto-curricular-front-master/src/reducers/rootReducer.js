import { combineReducers } from "redux";
import { adminReducer } from "./adminReducer";
import { authReducer } from "./authReducer";
import { vacanicesReducer } from "./vacanciesReducer";


export const rootReducer=combineReducers({
    auth:authReducer,
    vacancies:vacanicesReducer,
    admin:adminReducer,
});