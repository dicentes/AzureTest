import React, { Component } from 'react';

export class FetchFake extends Component {
  static displayName = FetchFake.name;

  constructor(props) {
    super(props);
    this.state = { data: '', loading: true };
  }

  componentDidMount() {
    this.populateData();
  }

  render() {
    // Display either "Loading..." or the fetched data
    let contents = this.state.loading
      ? <p><em>Loading...</em></p>
      : <p>{this.state.data}</p>;

    return (
      <div>
        <h1 id="tableLabel">Fake API Data</h1>
        <p>This component demonstrates fetching data from the /api/fake route.</p>
        {contents}
      </div>
    );
  }

  async populateData() {
    try {
      const response = await fetch('/api/fake');
      
      // Check if the request was successful
      if (response.ok) {
        const data = await response.text();
        this.setState({ data: data, loading: false });
      } else {
        this.setState({ data: 'I couldn\'t fetch anything', loading: false });
      }
    } catch (error) {
      // Handle network errors or other issues
      this.setState({ data: 'I couldn\'t fetch anything', loading: false });
    }
  }
}
