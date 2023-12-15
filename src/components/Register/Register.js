import React, { useState } from 'react';

const Register = ({ onRouteChange, loadUserProfile }) => {
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');

  const onRegisterNameChange = (event) => {
    setRegisterName(event.target.value);
  };

  const onRegisterEmailChange = (event) => {
    setRegisterEmail(event.target.value);
  };

  const onRegisterPasswordChange = (event) => {
    setRegisterPassword(event.target.value);
  };

  const onButtonSubmit = () => {
    fetch('http://localhost:3000/register', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: registerName,
        email: registerEmail,
        password: registerPassword,
      }),
    })
      .then((response) => response.json())
      .then((user) => {
        if (user.id) {
          loadUserProfile(user);
          onRouteChange('home');
        }
      });
  };

  return (
    <article className='br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center'>
      <main className='pa4 black-80'>
        <div className='measure'>
          <fieldset id='register' className='ba b--transparent ph0 mh0'>
            <legend className='f2 fw6 ph0 mh0'>Register</legend>
            <div className='mt3'>
              <label className='db fw6 lh-copy f6' htmlFor='name'>
                Name
              </label>
              <input
                className='pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100'
                autoComplete='username'
                type='text'
                name='name'
                id='name'
                onChange={onRegisterNameChange}
              />
            </div>
            <div className='mt3'>
              <label className='db fw6 lh-copy f6' htmlFor='email-address'>
                Email
              </label>
              <input
                className='pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100'
                autoComplete='email'
                type='email'
                name='email-address'
                id='email-address'
                onChange={onRegisterEmailChange}
              />
            </div>
            <div className='mv3'>
              <label className='db fw6 lh-copy f6' htmlFor='password'>
                Password
              </label>
              <input
                className='b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100'
                autoComplete='current-password'
                type='password'
                name='password'
                id='password'
                onChange={onRegisterPasswordChange}
              />
            </div>
          </fieldset>
          <div className=''>
            <input
              onClick={onButtonSubmit}
              className='b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib'
              type='submit'
              value='Register'
            />
          </div>
        </div>
      </main>
    </article>
  );
};

export default Register;
