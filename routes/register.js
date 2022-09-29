var express = require('express');
var router = express.Router();
const bcrypt = require('bcryptjs')

//stripe imports
const stripe = require('stripe')(process.env.STRIPE_SECRET)
const endpointSecret = process.env.ENDPOINT_SECRET
const baseURL = 'http://localhost:3000'

router.get('/', (req, res)=> {
    res.render('register')
})

//add check for current user
//add alerts 
router.post('/adduser', async(req, res) => {
    //set user data 
    var userData = req.body

    try{
        //hash password and store it in the userData object
        bcrypt.hash(userData.password, 12, (err, hashPassword)=> {
            if(err) throw new Error(err)
            userData.password = hashPassword
        })

        //create stripe session
        console.log('Redirecting user to payment site')
        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price_data: {
                        currency: 'cad',
                        product_data: {
                            name: 'Homebrew Club Membership',
                        },
                        unit_amount: 1000,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${baseURL}/auth/login`,
            cancel_url: `${baseURL}/register`,
            customer_email: userData.email,
            client_reference_id: req.sessionID
        })
        req.session.userData = userData;
        res.redirect(303, session.url)
    }catch (err) {
        console.log(err)
        throw new Error(err)
    }
})

//make sure to use express V4.17 and up to use express.raw()
router.post('/payment', express.raw({ type: '*/*' }), async(req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        //check sigintaure
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
        // Return a 200 res to acknowledge receipt of the event
        res.sendStatus(200);
        // Handle the event
        switch (event.type) {
            case 'checkout.session.completed':
                const charge = event.data.object;
                const sessionID = charge.client_reference_id
                console.log('Adding User')
                //restore session and create user
                req.sessionStore.get(sessionID, async (err, session) => {
                    //console.log(session)
                    const userData = session.userData
                    
                    //Add user
                    const result = await new (require('../database/users'))().create(userData)
                    if(result){
                        console.log('user added')
                        req.session.paid = 1
                    }
                        req.session.paid = 0
                })
                break;
            default:
        }
    } catch (err) {
        console.log(err)
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }

})





module.exports = router