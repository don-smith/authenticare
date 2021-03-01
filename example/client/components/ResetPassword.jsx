import React, { useState } from 'react'
import { resetPassword } from 'authenticare/client'

import { baseApiUrl as baseUrl } from '../config'
import { GridForm, ColOne, ColTwo, Button, Error, Info } from './Styled'

function ResetPassword (props) {
  const [info, setInfo] = useState('')
  const [error, setError] = useState('')
  const [email, setEmail] = useState('')

  function handleChange (e) {
    setEmail(e.target.value)
  }

  function handleSubmit (e) {
    e.preventDefault()
    return resetPassword(email, { baseUrl })
      .then((token) => {
        setInfo('Please check your email to finish resetting your password')
        return null
      })
      .catch((err) => {
        setError(err.message)
      })
  }

  const hideError = () => {
    setError('')
  }

  const hideInfo = () => {
    setInfo('')
  }

  return (
    <>
      <Error onClick={hideError}>
        { error && `Error: ${error}` }
      </Error>
      <Info onClick={hideInfo}>
        { info && `Info: ${info}` }
      </Info>
      <h2>Reset Password</h2>
      <GridForm onSubmit={handleSubmit}>
        <ColOne htmlFor='email'>Email:</ColOne>
        <ColTwo type='text' required
          id='email'
          name='email'
          value={email}
          onChange={handleChange} />

        <Button>Reset password</Button>
      </GridForm>
    </>
  )
}

export default ResetPassword
