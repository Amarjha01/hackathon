import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { loadStripe } from '@stripe/stripe-js';
const stripePromise = loadStripe('pk_test_51REr3D4Pm8bi1bka0tMXqVjPNPyEbfMEb97yP1sMgquLKLusTHjAtatfqPxEl6txhc8F5X8uN94FV3tWyUUA9MWF005QM2JElh'); 

import {
  FaUser,
  FaIdCard,
  FaUniversity,
  FaCode,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaSpinner,
} from 'react-icons/fa';
import { RiParentLine } from 'react-icons/ri';
import { MdSchool } from 'react-icons/md';
import { IoMdCheckmarkCircleOutline } from 'react-icons/io';

export default function FeePaymentForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('http://localhost:5000/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          amount: parseInt(data.amount), // convert to number
        }),
      });
  
      const result = await response.json();
  
      if (result.sessionId) {
        const stripe = await stripePromise;
        await stripe.redirectToCheckout({ sessionId: result.sessionId });
      } else {
        console.error('Stripe session creation failed:', result);
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error('Error:', err);
      setIsSubmitting(false);
    }
  };
  
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] flex items-center justify-center p-4">
      <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl shadow-2xl p-6 w-full max-w-2xl space-y-8">
        {/* Header */}
        <div className="text-center">
          <FaUniversity className="text-cyan-400 text-4xl mx-auto mb-2" />
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            Pay Your College Fee Online
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Complete the form below to process your payment
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 text-white">
          {/* Full Name */}
          <InputField
            label="Full Name"
            placeholder="Enter your full name"
            name="fullName"
            register={register}
            errors={errors}
            validation={{ required: 'Full name is required' }}
          />

          {/* Father's Name */}
          <InputField
            placeholder="Enter father's name"
            name="fatherName"
            register={register}
            errors={errors}
            validation={{ required: "Father's name is required" }}
          />

          {/* Student Unique ID */}
          <InputField
            label="Student Unique ID"
            placeholder="Enter your student ID"
            name="studentId"
            register={register}
            errors={errors}
            validation={{
              required: 'Student ID is required',
              pattern: {
                value: /^[a-zA-Z0-9]+$/,
                message: 'Invalid ID format',
              },
            }}
          />

          {/* Course & Branch */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectField
              label="Course"
              name="course"
              register={register}
              errors={errors}
              options={['BTech', 'BSc', 'BA', 'BCA', 'BBA']}
            />
            <SelectField
              label="Branch"
              name="branch"
              register={register}
              errors={errors}
              options={['CSE', 'IT', 'ECE', 'EE', 'ME', 'CE']}
            />
          </div>

          {/* Year & Session */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectField
              label="Year"
              name="year"
              register={register}
              errors={errors}
              options={['1st', '2nd', '3rd', '4th']}
            />
            <InputField
              label="Session"
              placeholder="2024-2025"
              name="session"
              register={register}
              errors={errors}
              validation={{
                required: 'Session is required',
                pattern: {
                  value: /^\d{4}-\d{4}$/,
                  message: 'Format: 2024-2025',
                },
              }}
            />
          </div>

          {/* Amount */}
          <InputField
            label="Amount to Pay (₹)"
            placeholder="Enter amount"
            name="amount"
            type="number"
            register={register}
            errors={errors}
            validation={{
              required: 'Amount is required',
              min: {
                value: 1,
                message: 'Amount must be positive',
              },
            }}
          />

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-lg bg-cyan-500 hover:bg-cyan-600 transition-all duration-200 text-white font-semibold flex justify-center items-center"
          >
            {isSubmitting ? (
              <>
                <FaSpinner className="animate-spin mr-2" /> Processing...
              </>
            ) : isSuccess ? (
              <>
                <IoMdCheckmarkCircleOutline className="mr-2" /> Payment Successful
              </>
            ) : (
              'Pay Now'
            )}
          </button>
        </form>

        <p className="text-center text-gray-500 text-xs pt-4">
          © {new Date().getFullYear()} Secure payment processing. All data encrypted.
        </p>
      </div>
    </div>
  );
}

// Reusable InputField component
const InputField = ({ label, icon, name, placeholder, register, errors, validation, type = 'text' }) => (
  <div>
    <label className="text-sm mb-1 block">{label}</label>
    <div className="relative">
      <span className="absolute left-3 top-3 text-gray-400">{icon}</span>
      <input
        type={type}
        placeholder={placeholder}
        {...register(name, validation)}
        className={`pl-10 pr-4 py-2 w-full rounded-md bg-white/10 text-white placeholder-gray-400 border border-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-400 ${
          errors[name] ? 'border-red-500' : ''
        }`}
      />
    </div>
    {errors[name] && <p className="text-red-400 text-sm mt-1">{errors[name].message}</p>}
  </div>
);

// Reusable SelectField component
const SelectField = ({ label, icon, name, register, errors, options }) => (
  <div>
    <label className="text-sm mb-1 block">{label}</label>
    <div className="relative">
      <span className="absolute left-3 top-3 text-gray-400">{icon}</span>
      <select
        {...register(name, { required: `${label} is required` })}
        className={`pl-10 pr-4 py-2 w-full rounded-md bg-white/10 text-white placeholder-gray-400 border border-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-400 ${
          errors[name] ? 'border-red-500' : ''
        }`}
      >
        <option value="">Select</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
    {errors[name] && <p className="text-red-400 text-sm mt-1">{errors[name].message}</p>}
  </div>
);


















// import React, { useState, useEffect } from 'react';
// import { useForm } from 'react-hook-form';
// import { loadStripe } from '@stripe/stripe-js';
// import {
//   Elements,
//   useStripe,
//   useElements,
//   PaymentElement,
// } from '@stripe/react-stripe-js';

// import {
//   FaUser,
//   FaUniversity,
//   FaSpinner,
// } from 'react-icons/fa';
// import { IoMdCheckmarkCircleOutline } from 'react-icons/io';

// const stripePromise = loadStripe('pk_test_51REr3D4Pm8bi1bka0tMXqVjPNPyEbfMEb97yP1sMgquLKLusTHjAtatfqPxEl6txhc8F5X8uN94FV3tWyUUA9MWF005QM2JElh');

// export default function FeePaymentWrapper() {
//   const [clientSecret, setClientSecret] = useState('');
//   const [formData, setFormData] = useState(null);

//   const handleFormSubmit = async (data) => {
//     setFormData(data);

//     try {
//       const response = await fetch('http://localhost:5000/create-payment-intent', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           ...data,
//           amount: parseInt(data.amount),
//         }),
//       });

//       const result = await response.json();
//       if (result.clientSecret) {
//         setClientSecret(result.clientSecret);
//       } else {
//         console.error('Failed to get client secret');
//       }
//     } catch (error) {
//       console.error('Error creating payment intent:', error);
//     }
//   };

//   return (
//     <>
//       {!clientSecret ? (
//         <FeePaymentForm onFormSubmit={handleFormSubmit} />
//       ) : (
//         <Elements stripe={stripePromise} options={{ clientSecret }}>
//           <StripePaymentForm formData={formData} />
//         </Elements>
//       )}
//     </>
//   );
// }

// function FeePaymentForm({ onFormSubmit }) {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm();

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] flex items-center justify-center p-4">
//       <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl shadow-2xl p-6 w-full max-w-2xl space-y-8">
//         <div className="text-center">
//           <FaUniversity className="text-cyan-400 text-4xl mx-auto mb-2" />
//           <h1 className="text-2xl font-bold text-white">Pay Your College Fee</h1>
//         </div>

//         <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-5 text-white">
//           <InputField label="Full Name" name="fullName" placeholder="John Doe" register={register} errors={errors} validation={{ required: 'Full name is required' }} />
//           <InputField label="Father's Name" name="fatherName" placeholder="Father's Name" register={register} errors={errors} validation={{ required: 'Father name is required' }} />
//           <InputField label="Student ID" name="studentId" placeholder="ABC123" register={register} errors={errors} validation={{ required: 'Student ID is required' }} />
//           <InputField label="Session" name="session" placeholder="2024-2025" register={register} errors={errors} validation={{ required: 'Session is required' }} />
//           <InputField label="Amount (₹)" name="amount" placeholder="5000" type="number" register={register} errors={errors} validation={{ required: 'Amount is required', min: 1 }} />

//           <button type="submit" className="w-full py-3 bg-cyan-500 rounded-lg font-semibold">Continue to Payment</button>
//         </form>
//       </div>
//     </div>
//   );
// }

// function StripePaymentForm({ formData }) {
//   const stripe = useStripe();
//   const elements = useElements();
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isSuccess, setIsSuccess] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!stripe || !elements) return;

//     setIsSubmitting(true);

//     const { error } = await stripe.confirmPayment({
//       elements,
//       confirmParams: {
//         return_url: 'http://localhost:5173/success',
//       },
//     });

//     if (error) {
//       console.error(error.message);
//       setIsSubmitting(false);
//     } else {
//       setIsSuccess(true);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] flex items-center justify-center p-4">
//       <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl shadow-2xl p-6 w-full max-w-2xl space-y-6 text-white">
//         <h2 className="text-xl font-bold text-center">Complete Your Payment</h2>
//         <form onSubmit={handleSubmit}>
//           <PaymentElement />
//           <button
//             type="submit"
//             disabled={isSubmitting}
//             className="mt-6 w-full py-3 rounded-lg bg-cyan-500 hover:bg-cyan-600 transition-all text-white font-semibold flex justify-center items-center"
//           >
//             {isSubmitting ? (
//               <>
//                 <FaSpinner className="animate-spin mr-2" /> Processing...
//               </>
//             ) : isSuccess ? (
//               <>
//                 <IoMdCheckmarkCircleOutline className="mr-2" /> Payment Successful
//               </>
//             ) : (
//               'Pay Now'
//             )}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

// const InputField = ({ label, name, placeholder, register, errors, validation, type = 'text' }) => (
//   <div>
//     <label className="block text-sm mb-1">{label}</label>
//     <input
//       type={type}
//       placeholder={placeholder}
//       {...register(name, validation)}
//       className={`w-full p-2 rounded-md bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-400 ${
//         errors[name] ? 'border-red-500' : ''
//       }`}
//     />
//     {errors[name] && <p className="text-red-400 text-sm mt-1">{errors[name].message}</p>}
//   </div>
// );
