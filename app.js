require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Use the secret from .env

const endpointSecret = process.env.WEBHOOK_SECRET;
const app = express();
const port = process.env.PORT || 4239;

// In-memory array to store purchase history
let purchaseHistory = [];

// the webhook must be placed before app.use(json). No idea why it is like this ?
app.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  async (request, response) => {
    const payload = request.body;
    const sig = request.headers['stripe-signature'];

    let event;

    try {
      event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
    } catch (err) {
      console.log(err);
      return response.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (
      event.type === 'checkout.session.completed' ||
      event.type === 'checkout.session.async_payment_succeeded'
    ) {
      await fulfillCheckout(event.data.object.id);
    }

    response.status(200).end();
  }
);

app.use(cors());
app.use(express.json()); // Middleware to parse JSON payloads

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/payment', (req, res) => {
  res.send('This is link to payment');
});

// New endpoint to get products from Stripe
app.get('/stripe-products', async (req, res) => {
  try {
    const products = await stripe.products.list();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/create-checkout-session', async (req, res) => {
  try {
    console.log(req.body); // Log the incoming JSON payload
    const session = await stripe.checkout.sessions.create({
      line_items: req.body.items,
      mode: 'payment',
      success_url: `http://localhost:5173/`,
      cancel_url: `http://localhost:5173/`,
    });
    res.json({ id: session.id }); // Return the session ID */
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

async function fulfillCheckout(sessionId) {
  console.log('Fulfilling Checkout Session ' + sessionId);

  // TODO: Make this function safe to run multiple times,
  // even concurrently, with the same session ID

  // TODO: Make sure fulfillment hasn't already been
  // performed for this Checkout Session

  // Retrieve the Checkout Session from the API with line_items expanded
  const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ['line_items'],
  });

  // Check the Checkout Session's payment_status property
  // to determine if fulfillment should be performed
  // payment_status can be 'paid', 'unpaid', or 'no_payment_required'
  if (checkoutSession.payment_status !== 'unpaid') {
    // Record the purchase in the purchase history
    const items = checkoutSession.line_items.data.map((item) => ({
      id: item.id,
      item: item.description, // Assuming description is used as item name
      price: item.amount_total / 100, // Convert from cents to euros
      currency: 'EUR', // Assuming all transactions are in EUR
      date: new Date().toISOString().split('T')[0], // Current date
      status: 'Completed', // Set status to Completed
    }));

    purchaseHistory.push(...items); // Add items to purchase history
    console.log('Purchase history updated:', purchaseHistory);
  }
}

app.get('/purchase-history', async (req, res) => {
  res.json(purchaseHistory); // Return the recorded purchase history
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
