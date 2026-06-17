const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const pool = require('../utils/db');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const clientID = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

if (!clientID || !clientSecret) {
  console.warn("WARNING: Google OAuth credentials (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET) are missing in environment variables!");
}

passport.use(new GoogleStrategy({
    clientID: clientID || "dummy-google-client-id",
    clientSecret: clientSecret || "dummy-google-client-secret",
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

        // Generate a random secure dummy password for OAuth user
        const dummyPassword = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(dummyPassword, salt);

        // Create new user with fallback for name
        const userName = profile.displayName || (profile.name && `${profile.name.givenName || ''} ${profile.name.familyName || ''}`.trim()) || email.split('@')[0];
        const newUser = await pool.query(
          'INSERT INTO users (name, email, password, role, oauth_provider, oauth_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
          [userName, email, hashedPassword, role, 'google', profile.id]
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
}));

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
