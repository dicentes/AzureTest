// Import section remains the same
import React, { Component } from 'react';
import discobolus from './noun-discobolus-1310560.svg';

export class Home extends Component {
  static displayName = Home.name;

  render() {
    return (
      // flex-grow-1 makes this div take available space but not more
      <div className='content-wrapper'> 
      <div className="d-flex bd-highlight ">  
        <div className="textbox fs-1">
          <p>Welcome to Brocountability.</p>
          <p>Setting goals for yourself can be easy - <i>completing </i>them is hard. Brocountability is here to fix that.</p>
          <p>Register now to make an account and join other bros looking to improve themselves.</p>
        </div>

        {/* Set both width and height to 100% */}
        <img src={discobolus} alt="test icon" className="img-fluid frontpageimage flex-grow-1 " />
      </div>
      </div> 
    );
  }
}
