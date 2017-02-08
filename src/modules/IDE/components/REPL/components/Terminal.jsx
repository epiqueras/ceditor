import React, { Component, PropTypes } from 'react';

export default class Terminal extends Component {
  constructor(props) {
    super(props);
    this.openREPL = this.openREPL.bind(this);
    this.closeREPL = this.closeREPL.bind(this);
  }

  openREPL() {
    const { doOpenREPL } = this.props;
    doOpenREPL();
  }

  closeREPL() {
    const { doCloseREPL } = this.props;
    doCloseREPL();
  }

  render() {
    const { REPLIsOpen } = this.props;
    return (
      <div className="repl-container">
        <button onClick={this.openREPL} className={REPLIsOpen ? 'hide' : ''}><i className="material-icons">play_circle_outline</i></button>
        <button onClick={this.closeREPL} className={REPLIsOpen ? '' : 'hide'}><i className="material-icons">stop</i></button>
        <div className={`repl-overlay${REPLIsOpen ? '' : ' hide'}`} />
      </div>
    );
  }
}

Terminal.propTypes = {
  REPLIsOpen: PropTypes.bool.isRequired,
  doOpenREPL: PropTypes.func.isRequired,
  doCloseREPL: PropTypes.func.isRequired,
};
