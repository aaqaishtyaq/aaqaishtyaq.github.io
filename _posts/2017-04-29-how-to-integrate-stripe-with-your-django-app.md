---
layout: post
title:  Integrate Stripe with your Django app
---

I'm currently working on a side project called consolecowboys. It's a jobs board
aimed at backend and DevOps engineers. A friend of mine had created a similar
board for designers. It looks sleek and polished but most importantly, he's
actually making money off of it by using stripe to handle payments.

I started looking for articles on how to achieve the same functionality in Django
(my friend used Node.js) and couldn't find any that was good. I also didn't want
to use a pre-made library because I'm a Nerd like that. So in this post, I will
be sharing with you my step by step guide on how to integrate stripe with your
Django app to accept one off payments.

Grab a cuppa and let's get to it.

## Step 1: Get your Stripe API keys
If you don't already have an account with stripe, go ahead and sign up for one
(obviously). Once you're logged in, you'll be able to find your API keys in the
dashboard under the API section. Copy both your secret and publishable test
keys.

In your `settings.py` file, add the following lines:

```python

import os # Should be already imported

STRIPE_PUBLIC_KEY = os.environ.get("STRIPE_SECRET_KEY", "pk_YOUR_TEST_PUBLIC_KEY")
STRIPE_SECRET_KEY = os.environ.get("STRIPE_SECRET_KEY", "pk_YOUR_TEST_SECRET_KEY")

```
`os.environ.get` takes two arguments: the environment variable it's supposed to
fetch and an optional fallback value in case the environment variable does not
exist or is `None`.

*Please note that you want to keep your API keys secret. In production, make
sure to set your live api keys to these two environment variables.
Because we're in sandbox (dev) mode, we don't need to set the environment
variables therefore our test keys will be used instead.*

## Step 2: Add the payment form to your template

Assuming you have a `/payment-form` route, in your views.py add the following:

```python

from yourapp import settings

def payment_form(request):

    context = { "stripe_key": settings.STRIPE_PUBLIC_KEY }
    return render(request, "yourtemplate.html", context)

```

In your template, copy and paste the form found under the checkout section of
the stripe docs.

```html

<form action="/checkout" method="POST">
    <script src="https://checkout.stripe.com/checkout.js" class="stripe-button"
        data-key="stripe_key" # Make sure to wrap the variable name with double {}
        data-amount="2000"
        data-name="Your APp"
        data-description="Your Product"
        data-image="Link to your logo"
        data-currency="usd">
    </script>
</form>

```

Notice we passed the stripe `public_key` to the data-key attribute, by default,
it will be populated with your actual public key, but I just find it better to
use the variable instead.

We also set the action attribute of the form to `/checkout` which we'll create
in the next step. This route will process the checkout logic.

What's actually happening is this: When a user submits the form (ie: pays), their
bank account information is sent to stripe for processing. If the payment is
accepted, stripe will issue a POST request to the endpoint specified in the
action attribute of the form.
The idea is to then capture that token and use it to charge the user's card.

## Step 3: Handle the checkout process

First we need to create a route in our `urls.py` file:

```python

urlpatterns = [
    url(r"^checkout$", views.checkout, name="checkout_page")
]

```

Then in your `views.py` create the associated view function where we will charge
the user and save the new object.

Assuming the following model:

```python
# models.py

class Car(models.Model):
    name        = models.CharField(max_length=234)
    year        = models.CharField(max_length=4)
    charge_id   = models.CharField(max_length=234)

```

We process the payment like so:

```python

import stripe
stripe.api_key = settings.STRIPE_SECRET_KEY

def checkout(request):

    new_car = Car(
        model = "Honda Civic",
        year  = 2017
    )

    if request.method == "POST":
        token    = request.POST.get("stripeToken")

    try:
        charge  = stripe.Charge.create(
            amount      = 2000,
            currency    = "usd",
            source      = token,
            description = "The product charged to the user"
        )

        new_car.charge_id   = charge.id

    except stripe.error.CardError as ce:
        return False, ce

    else:
        new_car.save()
        return redirect("thank_you_page")
        # The payment was successfully processed, the user's card was charged.
        # You can now redirect the user to another page or whatever you want

```

If you get an error, make sure to install the stripe module via pip:

```bash
pip install stripe
```

## Step 4: Test that it works

In your app, go ahead and visit the payment form page at /payment-form, you
should see a blue button that reads "pay with card".
Clicking on it will display the stipe payment form, you can test it by entering
any fake email address, and the test card info that can be found in the stripe
docs.

After your test payments are validated they will show up in your stripe
dashboard so you can review them.

## Conclusion

Hopefully this was clear enough and easy to follow, you can now accept one time
payments on your django app. If you have any questions or comments, feel free to
ping me on Twitter.

