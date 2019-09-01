import React, { Component } from 'react';

class LoaderDiv extends Component {

  render () {
    return (
      <div className="loader_div" style={this.props.showLoader}>
          <div className="loader">Loading...</div>
      </div>
    )
  }
}


export default LoaderDiv;
