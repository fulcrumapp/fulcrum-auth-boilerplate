import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { List } from 'semantic-ui-react';

import './Context.css';

export default class Context extends Component {
  static propTypes = {
    context: PropTypes.object.isRequired,
    onContextChosen: PropTypes.func.isRequired
  }

  constructor() {
    super();

    this.handleClick = this.handleClick.bind(this);
  }

  render() {
    return (
      <List.Item
        key={this.props.context.id}
        title={this.props.context.name}
        onClick={this.handleClick}
        className="context">
        <List.Content>
          <List.Header>{this.props.context.name}</List.Header>
        </List.Content>
      </List.Item>
    );
  }

  handleClick() {
    this.props.onContextChosen(this.props.context);
  }
}
