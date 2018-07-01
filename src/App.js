import React, { Component } from 'react';
import { Client } from 'fulcrum-app';
import { Container, Header, Button } from 'semantic-ui-react';

import LogIn from './LogIn';
import { get, set, unset } from './storage';

import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sessionKnown: false,
      loggedIn: false
    };

    this.handleLoggedIn = this.handleLoggedIn.bind(this);
    this.handleLogOut = this.handleLogOut.bind(this);
  }

  componentDidMount() {
    this.checkSession();
  }

  render() {
    const { user, organization, authorization, loggedIn, sessionKnown } = this.state;

    if (!sessionKnown) {
      return (
        <Container text>
          <Header
            dividing
            as="h1">
            Loading ...
          </Header>
        </Container>
      );
    }

    if (!loggedIn) {
      return (
        <LogIn onLoggedIn={this.handleLoggedIn} />
      );
    }

    return (
      <Container text>
        <Header
          dividing
          as="h1">
          Success!
        </Header>
        <div className="App">
          <p>
            You are logged in as {user.first_name} {user.last_name} ({user.email}) in the {organization.name} organization.
          </p>
          <p>
            Your API token is {authorization.token} and expires {authorization.expires_at || 'never'}.
          </p>
          <p>
            <Button
              color="teal"
              onClick={this.handleLogOut}>
              Log Out
            </Button>
          </p>
        </div>
      </Container>
    );
  }

  async checkSession() {
    try {
      const session = await get('session');

      if (session) {
        this.client = new Client(session.authorization.token);

        try {
          await this.client.forms.all({per_page: 1, page: 1, schema: false});
          const state = {
            sessionKnown: true,
            loggedIn: true,
            user: session.user,
            organization: session.context,
            authorization: session.authorization
          };
          this.setState(state);
        } catch (err) {
          console.log('Looks like the session timed out');
          console.log(err.message);
          this.handleLogOut();
        }
      } else {
        this.handleLogOut();
      }
    } catch (err) {
      this.handleLogOut();
    }
  }

  async handleLoggedIn(user, context, authorization) {
    await set('session', {user, context, authorization});

    this.client = new Client(authorization.token);

    const state = {
      loggedIn: true,
      sessionKnown: true,
      user: user,
      organization: context,
      authorization: authorization
    };

    this.setState(state);
  }

  async handleLogOut() {
    await unset('session');

    delete this.client;

    const state = {
      sessionKnown: true,
      loggedIn: false,
      user: null,
      authorization: null,
      organization: null
    };

    this.setState(state);
  }
}

export default App;
