import React, { useState } from 'react';

const Signin = ({ onRouteChange, setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmitSignIn = (event) => {
    event.preventDefault();
    fetch('http://fioripi:3000/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
      .then((response) => {
        if (!response.ok) {
          // Check for 400 status code
          if (response.status === 400) {
            throw new Error('Bad Request - Invalid email or password');
          }
          // Handle other non-successful status codes here if needed
          throw new Error(`Server Error: ${response.status}`);
        }
        return response.json();
      })
      .then((user) => {
        if (user.id) {
          setUser(user);
          onRouteChange('home');
        }
      })
      .catch((error) => {
        console.error('Error:', error.message);
        // Handle errors or show error message to the user
      });
  };

  return (
    <article className="br3 ba b--black-10 bg-black-40 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
      <main className="pa4 white-80">
        <form id="loginForm" onSubmit={onSubmitSignIn} className="measure">
          <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
            <legend className="f4 fw6 ph0 mh0">Sign In</legend>
            <div className="mt3">
              <label className="db fw6 lh-copy f6">Email</label>
              <input className="pa2 input-reset ba  bg-transparent white-80 hover-bg-black hover-white w-100" required type="email" name="email-address" id="email-address" onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="mv3">
              <label className="db fw6 lh-copy f6">Password</label>
              <input className="b pa2 input-reset ba bg-transparent white-80 hover-bg-black hover-white w-100" required type="password" name="password" id="password" onChange={(e) => setPassword(e.target.value)} />
            </div>
          </fieldset>
          <div className="">
            <input className="b ph3 pv2 input-reset white-80 ba b--white bg-transparent grow pointer f6 dib" type="submit" value="Sign in" />
          </div>
          <div className="lh-copy mt3">
            <p onClick={() => onRouteChange('register')} className="f6 link dim white-80 db pointer">
              Register
            </p>
          </div>
        </form>
      </main>
    </article>
  );
};

export default Signin;
