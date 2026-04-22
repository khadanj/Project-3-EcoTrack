// this is the login page where users can sign in to their account
import { useState } from 'react';
import { useUser } from '../context/UserContext';
import PropTypes from 'prop-types';
import './LoginPage.css';

const DEMO_EMAIL = 'demo@ecotrack.com';
const DEMO_PASSWORD = 'demo1234';

function LoginPage({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // get the setUser function from the user context
  const { setUser } = useUser();

  // shared login path so the form submit and the demo button both use it
  function login(emailValue, passwordValue) {
    fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: emailValue, password: passwordValue }),
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        if (data.user) {
          setUser(data.user);
          onLoginSuccess();
        } else {
          setError(data.message);
        }
      });
  }

  function handleSubmit(e) {
    e.preventDefault();
    login(email, password);
  }

  function handleDemoLogin() {
    setEmail(DEMO_EMAIL);
    setPassword(DEMO_PASSWORD);
    setError('');
    login(DEMO_EMAIL, DEMO_PASSWORD);
  }

  return (
    <div className="login-page">
      <h1 className="app-title"> EcoTrack</h1>
      <h2>Login</h2>

      {error && (
        <p className="error-message" role="alert">
          {error}
        </p>
      )}

      <div className="demo-callout">
        <p className="demo-callout-title">Just want to look around?</p>
        <p className="demo-callout-body">
          Sign in with the demo account to explore the seeded data.
        </p>
        <button
          type="button"
          className="demo-login-btn"
          onClick={handleDemoLogin}
        >
          Log in as demo user
        </button>
        <p className="demo-credentials">
          <span>
            <strong>Email:</strong> {DEMO_EMAIL}
          </span>
          <span>
            <strong>Password:</strong> {DEMO_PASSWORD}
          </span>
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="login-email">Email: </label>
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={function (e) {
              setEmail(e.target.value);
            }}
          />
        </div>

        <div>
          <label htmlFor="login-password">Password: </label>
          <input
            id="login-password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={function (e) {
              setPassword(e.target.value);
            }}
          />
        </div>

        <button type="submit">Login</button>
      </form>

      <p>
        No account with Us?
        <button
          type="button"
          onClick={function () {
            onLoginSuccess('register');
          }}
        >
          Register here
        </button>
      </p>
    </div>
  );
}

LoginPage.propTypes = {
  onLoginSuccess: PropTypes.func,
};

export default LoginPage;
