import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import Nav from './Nav'
import Fruits from './Fruits'
import Register from './Register'
import SignIn from './SignIn'
import ResetPassword from './ResetPassword'

export default function App () {
  return (
    <Router>
      <Route path='/' component={Nav} />
      <Route exact path='/' component={Fruits} />
      <Route path='/register' component={Register} />
      <Route path='/signin' component={SignIn} />
      <Route path='/reset-password' component={ResetPassword} />
    </Router>
  )
}
