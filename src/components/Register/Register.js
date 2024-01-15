import React, { useState } from 'react';

const Register = ({ onRouteChange, setUser }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmitRegister = (event) => {
    event.preventDefault();
    fetch(`${process.env.REACT_APP_API_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
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
        <form id="registerForm" onSubmit={onSubmitRegister} className="measure">
          <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
            <legend className="f4 fw6 ph0 mh0">Register</legend>
            <div className="mt3">
              <label className="db fw6 lh-copy f6">Name</label>
              <input className="pa2 input-reset ba white-80 bg-transparent hover-bg-black hover-white w-100" required type="text" name="name" id="name" onChange={(event) => setName(event.target.value)} />
            </div>
            <div className="mt3">
              <label className="db fw6 lh-copy f6">Email</label>
              <input className="pa2 input-reset ba white-80 bg-transparent hover-bg-black hover-white w-100" required type="email" name="email-address" id="email-address" onChange={(event) => setEmail(event.target.value)} />
            </div>
            <div className="mv3">
              <label className="db fw6 lh-copy f6">Password</label>
              <input className="b pa2 input-reset white-80 ba bg-transparent hover-bg-black hover-white w-100" required type="password" name="password" id="password" onChange={(event) => setPassword(event.target.value)} />
            </div>
          </fieldset>
          <div className="">
            <input className="b ph3 pv2 input-reset ba b--white white-80 bg-transparent grow pointer f6 dib" type="submit" value="Register" />
          </div>
        </form>
      </main>
    </article>
  );
};

export default Register;
