import React, { Component } from 'react';
import { NavMenu } from './NavMenu';

export class Layout extends Component {
  static displayName = Layout.name;

  render() {
    return (
      <div className="main-content">
        <NavMenu />
        <div className="content-wrapper">
          {this.props.children}
        </div>
      </div>
    );
  }
}
