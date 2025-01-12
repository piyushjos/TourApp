const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');
const bookingController = require('./../controllers/bookingController');

const router = express.Router();

router.get(
  '/',
  async (req, res, next) => {
    console.time('Booking Checkout');
    await bookingController.createBookingCheckout(req, res, next);
    console.timeEnd('Booking Checkout');
  },
  async (req, res, next) => {
    console.time('Auth Check');
    await authController.isLoggedIn(req, res, next);
    console.timeEnd('Auth Check');
  },
  async (req, res) => {
    console.time('Overview Rendering');
    await viewsController.getOverview(req, res);
    console.timeEnd('Overview Rendering');
  }
);

router.get('/tour/:slug', authController.isLoggedIn, viewsController.getTour);
router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);
router.get('/me', authController.protect, viewsController.getAccount);
router.get('/my-tours', authController.protect, viewsController.getMyTours);


router.post(
  '/submit-user-data',
  authController.protect,
  viewsController.updateUserData
);

module.exports = router;
