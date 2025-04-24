// import cors from "cors";
// import dotenv from "dotenv";
// import express from "express";
// import mongoose from "mongoose";
// import Stripe from 'stripe';
// import { connectDB } from "../server/src/db/index.js";

// // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
// // console.log('stripe',  stripe);  

// const app = express();
// app.use(
//   cors({
//     origin: process.env.CORS_ORIGIN, // Ensure that the CORS origin is correctly set in your environment variables
//     credentials: true, // Allow credentials to be sent with requests (like cookies or headers)
//   })
// );

// dotenv.config({
//   path: "./.env"
// });

// app.use(express.json());


// //database connection 
// connectDB()
//   .then(() => {
//     app.listen(process.env.PORT || 5000, () => {
//       console.log(`server is running at port: ${process.env.PORT}`);
//     });

//     app.on("error", (err) => {
//       console.log("App unable to connect: ", err);
//     });
//   })
//   .catch((err) => {
//     console.log("MongoDB connection failed!!!", err);
//   });





// // app.post('/create-checkout-session', async (req, res) => {
// //     const { fullName, studentId, amount } = req.body;
  
// //     const session = await stripe.checkout.sessions.create({
// //         payment_method_types: ['card', 'link', 'paypal', 'klarna', 'alipay'],
// //       line_items: [
// //         {
// //           price_data: {
// //             currency: 'inr',
// //             product_data: {
// //               name: `College Fee Payment - ${fullName} (${studentId})`,
// //             },
// //             unit_amount: amount * 100, // convert to paisa
// //           },
// //           quantity: 1,
// //         },
// //       ],
// //       mode: 'payment',
// //       success_url: 'http://localhost:5173/success',
// //       cancel_url: 'http://localhost:5173/cancel',
// //     });
  
// //     res.json({ sessionId: session.id });
// //   });




// app.listen(5000, () => console.log('Server running on port 5000'));


// // require('dotenv').config();
// // const express = require('express');
// // const cors = require('cors');
// // const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// // const app = express();

// // app.use(cors());
// // app.use(express.json());

// // app.post('/create-payment-intent', async (req, res) => {
// //   const { fullName, studentId, amount } = req.body;

// //   try {
// //     const paymentIntent = await stripe.paymentIntents.create({
// //       amount: amount * 100, // in paise
// //       currency: 'inr',
// //       payment_method_types: ['card', ],
// //       description: `College Fee - ${fullName} (${studentId})`,
// //     });

// //     res.json({
// //       clientSecret: paymentIntent.client_secret, // 👈 send this to frontend
// //     });
// //   } catch (error) {
// //     console.error('Error creating payment intent:', error.message);
// //     res.status(500).json({ error: error.message });
// //   }
// // });

// // app.listen(5000, () => console.log('Server running on port 5000'));
