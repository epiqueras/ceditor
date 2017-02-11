import React, { Component, PropTypes } from 'react';
import { ipcRenderer } from 'electron';

export default class SettingsModal extends Component {
  constructor(props) {
    super(props);
    const { commands, doSetCommands } = this.props;
    this.state = { ...commands };
    this.handleCChange = this.handleCChange.bind(this);
    this.handleCPPChange = this.handleCPPChange.bind(this);
    this.handleJavaChange = this.handleJavaChange.bind(this);
    this.handlePythonChange = this.handlePythonChange.bind(this);
    this.saveChanges = this.saveChanges.bind(this);
    ipcRenderer.on('commandsChanges', (event, newCommands) => { doSetCommands(newCommands); this.setState(newCommands); });
  }

  handleCChange(event) {
    this.setState({ c: event.target.value });
  }

  handleCPPChange(event) {
    this.setState({ cpp: event.target.value });
  }

  handleJavaChange(event) {
    this.setState({ java: event.target.value });
  }

  handlePythonChange(event) {
    this.setState({ python: event.target.value });
  }

  saveChanges(event) {
    event.preventDefault();
    const { doCloseModal, doSetCommands } = this.props;
    ipcRenderer.sendSync('setCommands', this.state);
    doSetCommands(this.state);
    doCloseModal();
  }

  render() {
    const { c, cpp, java, python } = this.state; // eslint-disable-line
    const { doCloseModal } = this.props;
    return (
      <div>
        <div>Build Commands:</div>
        <form onSubmit={this.saveChanges}>
          <label htmlFor="c">
            C:
            <input
              id="c"
              placeholder="e.g. gcc"
              type="text"
              value={c}
              onChange={this.handleCChange}
            />
          </label>
          <label htmlFor="cpp">
            C++:
            <input
              id="cpp"
              placeholder="e.g. gpp"
              type="text"
              value={cpp}
              onChange={this.handleCPPChange}
            />
          </label>
          <label htmlFor="java">
            Java:
            <input
              id="java"
              placeholder="e.g. java"
              type="text"
              value={java}
              onChange={this.handleJavaChange}
            />
          </label>
          <label htmlFor="python">
            Python:
            <input
              id="python"
              placeholder="e.g. python"
              type="text"
              value={python}
              onChange={this.handlePythonChange}
            />
          </label>
          <button type="button" onClick={doCloseModal}>Cancel</button>
          <button type="submit">Save</button>
        </form>
      </div>
    );
  }
}

SettingsModal.propTypes = {
  commands: PropTypes.shape({
    c: PropTypes.string.isRequired,
    cpp: PropTypes.string.isRequired,
    java: PropTypes.string.isRequired,
    python: PropTypes.string.isRequired,
  }).isRequired,
  doCloseModal: PropTypes.func.isRequired,
  doSetCommands: PropTypes.func.isRequired,
};
