const express = require('express')
const router = express.Router()
const Middleware = require('../helper/middleware')
const DB = require('../database/users')

//global instanc
const middleware = new Middleware()
const db = new DB()

//check all routes for logged in
router.all('/*', middleware.csrfMiddleware, middleware.profileMiddleware, (req, res, next) => {
    req.session.loggedin ? next() : res.status(401).render('NotLoggedIn')
})

//Main page load
router.get('/', async (req, res) => {
    const csrfToken = req.csrfToken()
    //get shopping lists for user
    console.log("Searching for shopping list")
    const result = await db.findById(req.session.user.id, '"shoppingList"')

    //parse out list names
    if (result) {
        var listNames = []
        result.map(item => {
            if (listNames.indexOf(item.list_name) === -1) {
                listNames.push(item.list_name)
            }
        })
    }

    //initialze shopping list
    if (!req.session.shoppingList) {
        req.session.shoppingList = [];
    }
    //initialze shopping list name
    if (!req.session.selectedList) {
        req.session.selectedList = "Select Shopping List"
    }

    res.render('shoppingList', {
        csrfToken: csrfToken,
        profile: req.profile,
        listNames: listNames,
        shoppingList: req.session.shoppingList,
        selectedList: req.session.selectedList

    })
})

router.post('/list', async (req, res) => {
    const { listName } = req.body
    req.session.selectedList = listName;
    console.log("Gathering Selected Shopping List Data");
    const result = await UpdateList(listName)
    if (result) {
        req.session.shoppingList = result
    }
    res.status(200).redirect('/shoppingList')
})

router.get('/create', (req, res) => {
    //request csrf token
    const csrfToken = req.csrfToken()

    //initilize shopping list
    if (!req.session.shoppingList) {
        req.session.shoppingList = initShoppingList()
    }

    //console.log(req.session.shoppingList)
    //render view
    res.render('shoppingListAdd', {
        csrfToken: csrfToken,
        profile: req.profile,
        shoppingList: req.session.shoppingList,
        itemNum: 1,
    })
})

router.post('/create', async (req, res) => {
    var list = req.body
    delete list._csrf
    //add user id to object
    list = { ...list, user_id: req.profile.id }
    //console.log(list)
    const result = await db.create(list, "shoppingList")
    if (result) {
        const shoppingList = await db.findByName(list.list_name, '"shoppingList"')
        req.session.shoppingList = shoppingList
        res.status(200).redirect('/shoppingList/create')
    }
})

router.post('/removeEntry', async (req, res) => {
    const listID = req.body.index;
    const result = await db.deleteItem(listID, '"shoppingList"');
    if (result) {
        const newList = await UpdateList(req.session.selectedList)
        if (newList) {
            req.session.shoppingList = newList;
            res.status(200).redirect('/shoppingList');
        }
    }
})

router.post('/removeList', async (req, res) => {
    const listName = req.body.selectedList;
    const result = await db.deleteByName(listName, '"shoppingList"');
    if (result) {
        req.session.selectedList = '';
        req.session.shoppingList = [];
        res.status(200).redirect('/shoppingList');
    }
})


async function UpdateList(listName) {
    const emptyList = initShoppingList;
    const result = await db.findByName(listName, '"shoppingList"');
    if (result) {
        return result;
    } else {
        return emptyList;
    }
}


function initShoppingList() {
    return {
        list_name: "",
        item_name: "",
        item_desc: "",
        price: 0,
    }
}


module.exports = router