const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const config = require("./config");
const { tokenTypes } = require("./tokens");
const {userService} = require('../services' )


const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.jwt.secret,
};


/**
 * @param payload - the payload the token was generated with
 * @param done - callback function
 */

const jwtVerify = async (payload, done) => {
  try {
    if(payload.type != tokenTypes.ACCESS){
      done(new Error("Invalid token type"), false);
    }
    const user = await userService.getUserById(payload.sub);
    if(!user){
      return done(null, false);
    }

    done(null, user);
  } catch (error) {
    done(error, false);
  }
};


const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

module.exports = {
  jwtStrategy
}
