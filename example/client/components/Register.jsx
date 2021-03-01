import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { register, isAuthenticated } from 'authenticare/client'

import { baseApiUrl as baseUrl } from '../config'
import { GridForm, ColOne, ColTwo, Button, Error } from './Styled'

function Register (props) {
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    username: '',
    password: '',
    email: ''
  })

  const hideError = () => {
    setError('')
  }

  function handleChange (e) {
    const { name, value } = e.target
    setForm({
      ...form,
      [name]: value
    })
  }

  function handleSubmit (e) {
    e.preventDefault()
    const { username, email, password } = form
    return register({ username, email, password }, { baseUrl })
      .then((token) => {
        if (isAuthenticated()) {
          props.history.push('/')
        }
        return null
      })
      .catch(err => {
        if (err.message === 'USERNAME_UNAVAILABLE') {
          setError('Username is not available')
        }
      })
  }

  return (
    <>
      <Error onClick={hideError}>
        { error && `Error: ${error}` }
      </Error>
      <h2>Register</h2>
      <GridForm onSubmit={handleSubmit}>
        <ColOne htmlFor='username'>Username:</ColOne>
        <ColTwo type='text' required
          id='username'
          name='username'
          value={form.username}
          onChange={handleChange} />

        <ColOne htmlFor='email'>Email:</ColOne>
        <ColTwo type='text' required
          id='email'
          name='email'
          value={form.email}
          onChange={handleChange} />

        <ColOne htmlFor='password'>Password:</ColOne>
        <ColTwo type='password' required
          id='password'
          name='password'
          value={form.password}
          onChange={handleChange}
          autocomplete='new-password' />

        <Button>Register</Button>

        <Link style={{ gridColumn: 2 }} to='/reset-password'>
          Forgot password
        </Link>
      </GridForm>
    </>
  )
}

export default Register
