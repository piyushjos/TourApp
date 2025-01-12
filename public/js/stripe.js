import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import {showAlert} from './alerts'

export const bookTour = async (tourId) => {
  try {
    // Initialize Stripe
    const stripe = await loadStripe(
      "pk_test_51Qe4JgDtfLUGZkgb667y61Enco73Pkh49ViFzXYSDCux8yfT0DNBi3HHxyj6eHw88xFStu3yz28WlerPrevCPdJV00qfcsshQM"
    );

    // Fetch session
    const session = await axios.get(
      `/api/v1/bookings/checkout-session/${tourId}`
    );


    //Redirect to Stripe Checkout
    await stripe.redirectToCheckout({
      
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.error("Error during booking tour:", err);
  }
};

