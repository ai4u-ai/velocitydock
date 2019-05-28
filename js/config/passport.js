/**
 * Created by jacobiv on 06/10/2016.
 */
var QueryParameter = require('passport-jwt').Strategy;
var AuthHeader= require('passport-jwt').Strategy;
ExtractJwt = require('passport-jwt').ExtractJwt;

// load up the user model
var User = require('../models/user');
var config = require('../config/database'); // get db config file
var passport	= require('passport');
var opts = {};
opts.jwtFromRequest = ExtractJwt.fromUrlQueryParameter('access_token');
opts.secretOrKey = config.secret;
QueryParameter=new QueryParameter(opts, function(jwt_payload, done) {
    User.findOne({_id: jwt_payload._id}, function(err, user) {
        if (err) {
            return done(err, false);
        }
        if (user) {
            done(null, user);
        } else {
            done(null, false);
            // or you could create a new account
        }
    });
});
QueryParameter.name="query";

passport.use(QueryParameter);

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
opts.secretOrKey = config.secret;
passport.use(new AuthHeader(opts, function(jwt_payload, done) {
    User.findOne({_id: jwt_payload._id}, function(err, user) {
        if (err) {
            return done(err, false);
        }
        if (user) {
            done(null, user);
        } else {
            done(null, false);
            // or you could create a new account
        }
    });
}));

module.exports = passport;