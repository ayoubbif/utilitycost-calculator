import React, { Component } from 'react';
import ProjectDashboard from './ProjectDashboard';
export default class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <>
        <ProjectDashboard />
      </>
    );
  }
}
