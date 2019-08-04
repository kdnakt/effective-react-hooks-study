import React from 'react';

class WithoutHooks extends React.Component<{}, {name:string;type:string}> {
  constructor(props: {}) {
    super(props);
    this.state = { name: 'serval', type: 'friends' };
    this.handleChangeName = this.handleChangeName.bind(this);
    this.handleChangeType = this.handleChangeType.bind(this);
  }

  handleChangeName(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ name: e.target.value });
  }

  handleChangeType(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ type: e.target.value });
  }

  render() {
    return (
      <div>
        <input value={this.state.name} onChange={this.handleChangeName} />
        <input value={this.state.type} onChange={this.handleChangeType} />
        <h2>{`${this.state.name} is ${this.state.type}`}</h2>
      </div>
    );
  }
}

export default WithoutHooks;