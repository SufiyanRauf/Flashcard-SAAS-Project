import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

function formatAmountForStripe(amount) {
  // Stripe expects the amount in the smallest currency unit (e.g., cents)
  return Math.round(amount * 100);
}

export async function POST(req) {
  const checkoutSession = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "Pro Subscription",
          },
          unit_amount: formatAmountForStripe(5), // <-- Price updated to $5
          recurring: {
            interval: "month",
            interval_count: 1,
          },
        },
        quantity: 1,
      },
    ],
    mode: "subscription",
    success_url: `${req.headers.get(
      "origin"
    )}/result?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${req.headers.get("origin")}/`, // Redirect to home on cancel
  });

  return NextResponse.json(checkoutSession);
}

export async function GET(req) {
  const searchParams = req.nextUrl.searchParams;
  const sessionId = searchParams.get("session_id");

  try {
    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);
    return NextResponse.json(checkoutSession);
  } catch (error) {
    return NextResponse.json(
      { error: { message: `Error retrieving checkout session: ${error.message}` } },
      { status: 500 }
    );
  }
}