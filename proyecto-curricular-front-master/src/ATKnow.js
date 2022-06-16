import React from 'react';
import { store } from "./store/store";
import { AppRouter } from './routers/AppRouter';
import { Provider } from "react-redux";

export const ATKnow = () => {
    return (
        <Provider store={store}>
            <AppRouter/>
        </Provider>
    )
}
