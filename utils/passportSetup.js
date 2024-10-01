const passport = require("passport");
const AppleStrategy = require('passport-apple');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const tokenManager = require('../helpers/tokenManager');

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
  passReqToCallback: true
},
  (request, accessToken, refreshToken, profile, done) => {
    console.log(`From passportSetup.js: accessToken: ${accessToken}, refreshToken: ${refreshToken}, profile: ${profile}`);
    done(null, profile);
  }
));

// passport.use(new AppleStrategy({
//   clientID: process.env.APPLE_CLIENT_ID,
//   teamID: process.env.APPLE_TEAM_ID,
//   callbackURL: process.env.APPLE_CALLBACK_URL, // redirectmeto.com is useful for local testing
//   keyID: process.env.APPLE_KEY_ID,
//   privateKeyString: process.env.APPLE_PRIVATE_KEY,
//   passReqToCallback: true,
// }, async (req, accessToken, refreshToken, idToken, profile, done) => {
//   const user = tokenManager.decodeToken(idToken);
//   done(null, user);
// }));