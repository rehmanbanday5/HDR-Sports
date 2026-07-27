const { body, validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array().map((e) => e.msg).join(', '));
  }
  next();
};

const registerRules = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 80 }),
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
];

const loginRules = [
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

const productRules = [
  body('name').trim().notEmpty().withMessage('Product name is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('basePrice').isFloat({ min: 0 }).withMessage('Base price must be a positive number'),
];

const orderRules = [
  body('customer.fullName').trim().notEmpty().withMessage('Full name is required'),
  body('customer.email').trim().isEmail().withMessage('Valid email is required'),
  body('customer.phone').trim().notEmpty().withMessage('Phone number is required'),
  body('shippingAddress.addressLine1').trim().notEmpty().withMessage('Address is required'),
  body('shippingAddress.city').trim().notEmpty().withMessage('City is required'),
  body('shippingAddress.postalCode').trim().notEmpty().withMessage('Postal code is required'),
  body('shippingAddress.country').trim().notEmpty().withMessage('Country is required'),
  body('items').isArray({ min: 1 }).withMessage('Order must contain at least one item'),
  body('paymentMethod').isIn(['cod', 'bank_transfer', 'stripe', 'jazzcash', 'easypaisa']).withMessage('Invalid payment method'),
];

module.exports = { validate, registerRules, loginRules, productRules, orderRules };
