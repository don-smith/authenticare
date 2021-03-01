#  Authenticare

> A JWT helper library for full-stack Node apps

You can find an example fullstack application in the `example` folder.

You can find the docs for the most important functions exported for both client-side and server-side use in the `docs` folder.

## Version `0.5.0`

* Add password reset feature (includes basis of 2FA: sending emails)
* Remove deprecated `server/decodeToken` in lieu of `server/getTokenDecoder`


## Version `0.4.9`

* Improved the error message coming from the client `register` and `signIn` functions
* Example: added an error message to the Register and SignIn pages to show the improved error message
* Docs: updated docs for `register` and `signIn` to illustrate how to use the error message


## Version `0.4.8`

* Replaced `libsodium-wrappers-sumo` with `libsodium`
* Removed `nock` as a `devDependency`
* Updated all possible dependencies
* Moved tests to same folder as code under test
* Running tests require NodeJS version 14 or greater (due to use of the [optional chaining operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining) `?`)
* Removed `testing` folder - I might bring it back later if I can get happy with it
* Improved lint config and applied fixes throughout codebase (thanks @joshuavial)
* Example: require username and password on sign-in and register forms
* A LOT of code refactorings (mostly aesthetics)


## Version `0.4.7`

* Updated dependencies
* Added the ability to configure token expiration (thank you @nisidazza)
* Removed the tutorial (too much to maintain) the example should suffice
* Example: moved `BASE_API_URL` environment variable into a config file
* Example: refactored tests


## Version `0.4.6`

* Bug fix related to `verifyEndpoint` (thank you @joshuavial)
* Updated dependencies to fix known security vulnerabilities


## Version `0.4.5`

* Updated dependencies to fix known security vulnerabilities


## Version `0.4.4`

* Added `server/token/getTokenDecoder` to replace `server/token/decode` to allow a route to succeed regardless if a token is provided or not. Currently `decode` will throw if a token is not found. `decode` is deprecated and will be removed in v0.5.0.
* Updated the example an tutorial to reflect this change.
* Updated dependencies to fix known security vulnerabilities.


## Version `0.4.3`

* Updated dependencies to fix known security vulnerabilities


## Version `0.4.2`

* Updated dependencies to fix known security vulnerabilities


## Version `0.4.1`

* Prevent publishing the tutorial in the npm package


## Version `0.4.0`

### Non-breaking changes

* `client/getDecodedToken` was added
* `client/getAuthorizationHeader` was added (`getEncodedToken` is still available, but less relevant now)
* A tutorial was added (but it still needs more work)

### Breaking changes

* `client/getAuthToken` was function renamed to `getDecodedToken` to match `getEncodedToken`
* The `createUser` function passed to `server/applyAuthRoutes` now takes a single `user` object parameter instead of `username` and `password` parameters
