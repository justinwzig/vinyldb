// Require packages
// Express & middleware
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
// PAssport, express-session, and local strategy
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');

const stylus = require("stylus");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const dbRouter = require("./routes/db"); // Import routes for "catalog" area of site

const compression = require("compression");
const helmet = require("helmet");

// Set up mongoose connection
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const PORT = process.env.PORT || 6969; // any port number is acceptable

const app = express(); // Inst express app

// Set up rate limiter: maximum of twenty requests per minute
const RateLimit = require("express-rate-limit");
const limiter = RateLimit({
  windowMs: 1 * 10 * 1000, // 10 seconds
  max: 100,
    windowMs: 1 * 10 * 1000, // 10 seconds
    max: 100,
});
// Apply rate limiter to all requests
app.use(limiter);


// const dev_db_url =
//   "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority";
// const mongoDB = process.env.MONGODB_URI || dev_db_url;
const mongoDB = "mongodb://127.0.0.1/"; // Set up default mongo connection

main().catch((err) => console.log(err));
async function main() {
    console.log("Connecting to MongoDB..." + mongoDB)
    await mongoose.connect(mongoDB);
}

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.locals.basedir = app.get("views");
app.set("view engine", "pug");

// Stylus middleware
app.use(stylus.middleware({
    src: __dirname + '/public/styl',
    dest: __dirname + '/public/stylesheets',
    compile: function (str, path) {
        return stylus(str)
            .set('filename', path)
            .set('compress', true);
    }
}));

app.use(logger("dev")); // Log requests to the console
app.use(express.json()); // JSON middleware for parsing requests
app.use(express.urlencoded({ extended: false })); // Parse URL-encoded bodies
app.use(cookieParser()); // Parse Cookie header and populate req.cookies with an object keyed by the cookie names.

app.use( // Secure app by setting various HTTP headers
    helmet.contentSecurityPolicy({ //contentSecurityPolicy` is an alias for `helmet.contentSecurityPolicy` that sets the `Content-Security-Policy` header.
        directives: {
            "defaultSrc": [
                "'self'",
                "'unsafe-inline'",
                'data:',
                'localhost',
                'main-domain.com',
                '*.main-domain.com',
            ],
            "script-src": [
                "'self'",
                "'unsafe-inline'",
                'public:',
                'public/javascripts:',
                'localhost',
                'main-domain.com',
                '*.main-domain.com',
                "code.jquery.com",
                "cdn.jsdelivr.net",
                "*", // Allow all scripts (e.g. for Google Analytics)
            ],
            "font-src": ["'self'", "fonts.gstatic.com"],
            "style-src": ["'self'", "'unsafe-inline'", "fonts.googleapis.com"],
            "script-src-attr": ["'unsafe-inline'"],
            "img-src": ["'self'", "'unsafe-inline'", "data:"],
            "connect-src": ["'self'"],
            "frame-src": ["'self'"],
            "object-src": ["'self'"],
        },
    })
);

// Passport middleware and user authentication
app.use(session({
    secret: 'your secret key',
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(async (username, password, done) => {
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return done(null, false, { message: 'Incorrect username' });
        }
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return done(null, false, { message: 'Incorrect password' });
        }
        return done(null, user);
    } catch (err) {
        return done(err);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});

app.use(compression()); // Compress all routes

app.use(express.static(path.join(__dirname, "public")));

// PLACE ROUTES BELOW THIS LINE

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/db", dbRouter); // Add  routes to middleware chain.

// PLACE ERROR HANDLERS BELOW THIS LINE

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
});

module.exports = app;
