import React, { Component } from 'react';
import discobolus from './noun-discobolus-1310560.svg';

export class Home extends Component {
  static displayName = Home.name;


  // Discobolus by Gonza from <a href="https://thenounproject.com/browse/icons/term/discobolus/" target="_blank" title="Discobolus Icons">Noun Project</a> (CC BY 3.0)
  render() {
    return (
      <div className="d-flex justify-content-between">
        <div>
          <p>Welcome to Brocountability.</p>
          <p>Setting goals for yourself can be easy - completing them is hard. Brocountability is here to fix that.</p>
          <p>Register now to make an account and join other bros looking to improve themselves.</p>
        </div>
        <img src={discobolus} alt="test icon" width="500" height="600" />
        
      </div>
    );
  }
}
