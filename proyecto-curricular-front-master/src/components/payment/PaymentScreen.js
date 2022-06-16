import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import { CheckoutForm } from './CheckoutForm';


const stripePromise = loadStripe(`${process.env.REACT_APP_STRIPE_KEY}`);


export const PaymentScreen = () => {
    return (
        <div className="my-5 pt-5">
            <Elements stripe={stripePromise} className="container">
                <CheckoutForm/>
            </Elements>
        </div>
    )
}
