const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const pool = require('../utils/db');
require('dotenv').config();

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || "http://localhost:5000/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'henimiranda9@gmail.com';
      // Check if user already exists
      const userRes = await pool.query('SELECT * FROM users WHERE email = $1', [profile.emails[0].value]);
      
      let user;
      if (userRes.rows.length > 0) {
        user = userRes.rows[0];
        // If user exists but doesn't have oauth_id, link them
        if (!user.oauth_id) {
          await pool.query('UPDATE users SET oauth_provider = $1, oauth_id = $2 WHERE id = $3', 
            ['google', profile.id, user.id]);
        }
      } else {
        // Tentukan role: admin hanya untuk email tertentu
        const email = profile.emails[0].value;
        const role = email === ADMIN_EMAIL ? 'admin' : 'customer';

        // Create new user
        const newUser = await pool.query(
          'INSERT INTO users (name, email, role, oauth_provider, oauth_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
          [profile.displayName, email, role, 'google', profile.id]
        );
        user = newUser.rows[0];
      }

      // Jika user sudah ada, pastikan email admin selalu punya role admin
      if (user && user.email === ADMIN_EMAIL && user.role !== 'admin') {
        await pool.query('UPDATE users SET role = $1 WHERE id = $2', ['admin', user.id]);
        user.role = 'admin';
      }

      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const userRes = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    done(null, userRes.rows[0]);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
