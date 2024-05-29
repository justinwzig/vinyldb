const express = require("express");
const router = express.Router();
const User = require('../models/user');

// Middleware to ensure user is authenticated
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

// GET request for creating a User. NOTE This must come before routes that display User (uses id).
router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const user = new User({ username, password });
    try {
        await user.save();
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
    res.redirect('/login');
});

// POST request for creating User.
router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) { return next(err); }
        if (!user) { return res.status(401).json({ error: info.message }); }
        req.logIn(user, function(err) {
            if (err) { return next(err); }
            return res.json({ success: true });
        });
    })(req, res, next);
});

/* GET users listing. */ // GET request for list of all User items.
router.get("/:id", function (req, res, next) {
    // Fetch user from database using req.params.id
    // ...
    if (req.accepts('json')) {
        res.json(user);
    } else {
        res.render('user', { user: user });
    }
});


// ANY ROUTES BELOW THIS LINE WILL REQUIRE AUTHENTICATION
router.use(ensureAuthenticated);


module.exports = router;


