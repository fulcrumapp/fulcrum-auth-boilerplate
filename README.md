## fulcrum-auth-boilerplate

This is a sample React web app that contains some boilerplate code that I find myself using often when creating small apps that need to authenticate with [Fulcrum](https://www.fulcrumapp.com/). Initially you are prompted for your email and password. After successfully authenticating we check which organizations you are a member of, and ask you which one you'd like to create an [authorization token](http://developer.fulcrumapp.com/endpoints/authorizations/) for. After creating the authorization token we stash it in localStorage, so the app can use it to make API calls.

## Hacking

This project was built using [Create React App](https://github.com/facebook/create-react-app) which does lots of fancy things like live reloading, production builds, informative errors, etc. To get started, install the dependencies.

```bash
yarn install
```

Then just start it.

```bash
yarn start
```

A new browser tab should open and you're good to go.
