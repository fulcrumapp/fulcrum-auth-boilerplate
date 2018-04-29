/* eslint no-alert: 0 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getUser, createAuthorization } from 'fulcrum-app';
import { Form, Button, Grid, Header, Segment, List, Message, Image } from 'semantic-ui-react';

import './LogIn.css';

import Context from './Context';

export default class LogIn extends Component {
  static propTypes = {
    onLoggedIn: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      contexts: null
    };
  }

  render() {
    const {contexts} = this.state;

    if (contexts) {
      if (contexts.length === 1) {
        this.handleContextChosen(contexts[0]);
        return null;
      }

      return (
        this.renderContexts()
      );
    }

    return (
      this.renderEmailPasswordForm()
    );
  }

  renderEmailPasswordForm() {
    return (
      <div className="login-form">
        <Grid
          textAlign="center"
          style={{ height: '100%' }}
          verticalAlign="middle">
          <Grid.Column style={{ maxWidth: 450 }}>
            <Header
              as="h2"
              color="teal"
              textAlign="center">
              Log in to your Fulcrum account
            </Header>
            <Form size="large">
              <Segment stacked>
                <Form.Input
                  fluid
                  icon="user"
                  iconPosition="left"
                  placeholder="Email"
                  onChange={this.handleEmailChange} />
                <Form.Input
                  fluid
                  icon="lock"
                  iconPosition="left"
                  placeholder="Password"
                  type="password"
                  onChange={this.handlePasswordChange} />
                <Button
                  disabled={this.state.email.length === 0 || this.state.password.length === 0}
                  fluid
                  color="teal"
                  size="large"
                  onClick={this.handleButtonClick}>
                  Log In
                </Button>
              </Segment>
            </Form>
          </Grid.Column>
        </Grid>
      </div>
    );
  }

  renderContexts() {
    return (
      <div className="login-form">
        <Grid
          textAlign="center"
          style={{ height: '100%' }}
          verticalAlign="middle">
          <Grid.Column style={{ maxWidth: 450 }}>
            <Message
              icon={
                <Image
                  circular
                  size="tiny"
                  src={this.user.image_small} />}
              header={`${this.user.first_name} ${this.user.last_name} (${this.user.email})`}
              content="Select your organization" />
            <Segment stacked>
              <List celled>
                {this.state.contexts.map((context) => {
                  return (
                    <Context
                      key={context.id}
                      context={context}
                      onContextChosen={this.handleContextChosen} />
                  );
                })}
              </List>
            </Segment>
          </Grid.Column>
        </Grid>
      </div>
    );
  }

  passwordInputRef = (ref) => {
    this.passwordInput = ref;
  }

  handleEmailChange = (event) => {
    this.setState({email: event.target.value.trim()});
  }

  handlePasswordChange = (event) => {
    this.setState({password: event.target.value.trim()});
  }

  handleAuthorized = (json) => {
    this.user = json;
    const contexts = json.contexts.filter((context) => context.role.can_manage_authorizations);
    this.setState({contexts});
  }

  handleContextChosen = (context) => {
    const {email, password} = this.state;

    const note = 'Fulcrum Auth Boilerplate';
    const timeout = 60 * 60 * 24; // Set to null for a non-expiring token

    createAuthorization(email, password, context.id, note, timeout)
      .then((authorization) => {
        delete this.user.contexts;
        this.props.onLoggedIn(this.user, context, authorization);
      })
      .catch(error => window.alert('There was an error creating your API token. ' + error.message));
  }

  handleButtonClick = () => {
    const {email, password} = this.state;

    getUser(email, password)
      .then(this.handleAuthorized)
      .catch(error => window.alert('Please check your credentials and try again.' + error.message));
  }
}
