# Stripe Integration with Express

This is a simple Express application that integrates with Stripe for payment processing. It includes endpoints for creating checkout sessions, handling webhooks, and retrieving purchase history.

## Table of Contents

- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Deployment](#deployment)
- [Setting Up Stripe Webhook](#setting-up-stripe-webhook)
- [Endpoints](#endpoints)

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/your-repo-name.git
   cd your-repo-name
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Create a `.env` file:**
   Copy the `.env.example` file to `.env` and fill in the required values:

   ```bash
   cp .env.example .env
   ```

4. **Set environment variables:**
   Update the `.env` file with your Stripe secret key and webhook secret:
   ```plaintext
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
   SUCCESS_URL=http://localhost:5173/
   CANCEL_URL=http://localhost:5173/
   PORT=4239
   ```

## Running the Application

1. **Start the server:**

   ```bash
   npm start
   ```

2. **Access the application:**
   Open your browser and navigate to `http://localhost:4239`.

## Deployment

To deploy the application on Vercel, follow these steps:

1. **Install Vercel CLI** (if you haven't already):

   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**

   ```bash
   vercel login
   ```

3. **Deploy your application:**
   Run the following command in your project directory:

   ```bash
   vercel
   ```

4. **Set environment variables on Vercel:**
   After deployment, you can set your environment variables using the Vercel dashboard or by running:

   ```bash
   vercel env add STRIPE_SECRET_KEY
   vercel env add STRIPE_WEBHOOK_SECRET
   vercel env add SUCCESS_URL
   vercel env add CANCEL_URL
   ```

5. **Open your deployed application:**
   After deployment, Vercel will provide a URL where your application is hosted. You can also access it at [https://stripe-demo-backend-three.vercel.app/](https://stripe-demo-backend-three.vercel.app/).

## Setting Up Stripe Webhook

1. **Log in to your Stripe Dashboard**: Go to [Stripe Dashboard](https://dashboard.stripe.com/).

2. **Navigate to Webhooks**: In the left sidebar, click on "Developers" and then "Webhooks".

3. **Add a new endpoint**:

   - Click on the "Add endpoint" button.
   - In the "Endpoint URL" field, enter your deployed application's webhook URL, which should look like this:
     ```
     https://stripe-demo-backend-three.vercel.app/webhook
     ```
   - Select the events you want to listen to. For this application, you should at least select:
     - `checkout.session.completed`
     - `checkout.session.async_payment_succeeded`

4. **Save the endpoint**: Click on the "Add endpoint" button to save your webhook configuration.

5. **Copy the webhook signing secret**: After creating the webhook, you will see a signing secret. Copy this value and update your `.env` file:
   ```plaintext
   STRIPE_WEBHOOK_SECRET=your_webhook_signing_secret
   ```

## Endpoints

- **GET /**: Returns a simple "Hello World!" message.
- **GET /payment**: Returns a link to payment.
- **GET /stripe-products**: Retrieves a list of products from Stripe.
- **POST /create-checkout-session**: Creates a checkout session with the provided items.
- **POST /webhook**: Handles Stripe webhook events.
- **GET /purchase-history**: Returns the recorded purchase history.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
