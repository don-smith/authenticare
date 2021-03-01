import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { signIn, isAuthenticated } from 'authenticare/client'

import { baseApiUrl as baseUrl } from '../config'
import { GridForm, ColOne, ColTwo, Button, Error } from './Styled'

function SignIn (props) {
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    username: '',
    password: ''
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
    const { username, password } = form
    return signIn({ username, password }, { baseUrl })
      .then((token) => {
        if (isAuthenticated()) {
          props.history.push('/')
        }
        return null
      })
      .catch(err => {
        if (err.message === 'INVALID_CREDENTIALS') {
          setError('Username and password combination not found')
        }
      })
  }

  return (
    <>
      <Error onClick={hideError}>
        { error && `Error: ${error}` }
      </Error>
      <h2>Sign in</h2>
      <GridForm onSubmit={handleSubmit}>
        <ColOne htmlFor='username'>Username:</ColOne>
        <ColTwo type='text' required
          id='username'
          name='username'
          value={form.username}
          onChange={handleChange} />

        <ColOne htmlFor='password'>Password:</ColOne>
        <ColTwo type='password' required
          id='password'
          name='password'
          value={form.password}
          onChange={handleChange}
          autocomplete='current-password' />

        <Button>Sign in</Button>

        <Link style={{ gridColumn: 2 }} to='/reset-password'>
          Forgot password
        </Link>
      </GridForm>
    </>
  )
}

export default SignIn
