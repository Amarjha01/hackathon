import {
    Elements,
    useStripe,
    useElements,
    PaymentElement,
  } from '@stripe/react-stripe-js';


  import { useEffect, useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_...');

const PaymentWrapper = ({ children, formData }) => {
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, [formData]);

  const appearance = { theme: 'night' };
  const options = { clientSecret, appearance };

  return clientSecret ? (
    <Elements stripe={stripePromise} options={options}>
      {children}
    </Elements>
  ) : (
    <div className="text-white">Loading payment options...</div>
  );
};

export default PaymentWrapper;
