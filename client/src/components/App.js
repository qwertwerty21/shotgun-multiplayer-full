import React, { Component } from 'react';
import '../styles/App.scss';

class App extends Component {
  render() {
    return (
      <div className="app__container">
        <div className="app-content__container container">
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default App;
