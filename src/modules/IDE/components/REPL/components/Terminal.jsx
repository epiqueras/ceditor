/* global window */
/* global document */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { Component, PropTypes } from 'react';
import { remote } from 'electron';

import runChildProcess, { appendOutput } from './childProcesses';

const { dialog } = remote;

export default class Terminal extends Component {
  constructor(props) {
    super(props);
    this.state = { modalValue: '' };
    this.inputRef = {};
    this.cp = false;
    this.setCaretToEnd = this.setCaretToEnd.bind(this);
    this.setInputRef = this.setInputRef.bind(this);
    this.setOutputRef = this.setOutputRef.bind(this);
    this.setCommand = this.setCommand.bind(this);
    this.openREPL = this.openREPL.bind(this);
    this.closeREPL = this.closeREPL.bind(this);
    this.handleModalChange = this.handleModalChange.bind(this);
    this.toStdin = this.toStdin.bind(this);
  }

  componentDidUpdate(prevProps) {
    const { REPLIsOpen } = this.props;
    if (prevProps.REPLIsOpen !== REPLIsOpen) {
      this.setCaretToEnd();
    }
  }

  setCaretToEnd() {
    this.inputRef.innerHTML = '>&nbsp;';
    const range = document.createRange();
    range.selectNodeContents(this.inputRef);
    range.collapse();
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }

  setInputRef(element) {
    this.inputRef = element;
  }

  setOutputRef(element) {
    this.outputRef = element;
  }

  setCommand(event) {
    event.preventDefault();
    const { activeFilePath, doCloseModal, doSetCommand } = this.props;
    doSetCommand(activeFilePath.slice(activeFilePath.lastIndexOf('.') + 1), this.state.modalValue);
    doCloseModal();
  }

  openREPL() {
    const { activeFilePath, commands, doOpenREPL, doOpenModal } = this.props;
    const fileName = activeFilePath.slice(activeFilePath.lastIndexOf('/') + 1);
    const cleanFileName = fileName.slice(0, fileName.lastIndexOf('.'));
    const fileExt = fileName.slice(fileName.lastIndexOf('.'));
    const command = { cmd: '', args: [], compileCmd: '', compileArgs: [], cwd: '', message: '' };

    switch (fileExt) {
      case '.c':
        if (!commands.c) return doOpenModal();
        command.compileCmd = commands.c;
        command.compileArgs = ['-o', `${cleanFileName}.o`, fileName];
        command.cmd = `${activeFilePath.slice(0, activeFilePath.lastIndexOf('.'))}.o`;
        command.cwd = activeFilePath.slice(0, activeFilePath.lastIndexOf('/'));
        command.message = "If you're having trouble with output buffering, copy this above your main function:\nsetvbuf(stdout, NULL, _IONBF, 0);\n\n";
        break;
      default:
        return dialog.showMessageBox({ message: 'Unsupported file type.' });
    }

    this.outputRef.innerHTML = '';
    this.outputRef.appendChild(this.inputRef);
    doOpenREPL();
    this.cp = runChildProcess(command, this.outputRef, this.inputRef);
    this.cp.on('close', (code) => {
      appendOutput(`child process exited with code ${code}\n`, this.outputRef, this.inputRef);
      this.cp = false;
    });
    return null;
  }

  closeREPL() {
    if (this.cp && this.cp.kill) this.cp.kill();
    this.cp = false;
    const { doCloseREPL } = this.props;
    doCloseREPL();
    this.inputRef.innerHTML = '';
    this.outputRef.innerHTML = '';
    this.outputRef.appendChild(this.inputRef);
  }

  handleModalChange(event) {
    this.setState({ modalValue: event.target.value });
  }

  toStdin(event) {
    if (event.keyCode === 13) {
      appendOutput(`${this.inputRef.textContent}\n`, this.outputRef, this.inputRef);
      if (!this.cp) appendOutput('Child process already exited, please rerun your code.\n', this.outputRef, this.inputRef);
      else this.cp.stdin.write(`${this.inputRef.textContent.slice(2)}\n`, 'utf8');
      this.setCaretToEnd();
    }
    if (event.keyCode === 8 && this.inputRef.textContent.length <= 2) {
      this.setCaretToEnd();
    }
  }

  render() {
    const { modalValue } = this.state;
    const { REPLIsOpen, modalIsOpen, doCloseModal } = this.props;
    return (
      <div className="repl-container">
        <button onClick={this.openREPL} className={`run-stop${REPLIsOpen ? ' hide' : ''}`}><i className="material-icons">play_circle_outline</i></button>
        <button onClick={this.closeREPL} className={`run-stop${REPLIsOpen ? '' : ' hide'}`}><i className="material-icons">stop</i></button>
        <div className={`repl-overlay${REPLIsOpen ? '' : ' hide'}`}>
          <div className="output" ref={this.setOutputRef}>
            <span
              className="input"
              ref={this.setInputRef}
              contentEditable
              onKeyUp={this.toStdin}
            />
          </div>
        </div>
        <div className={`modal${modalIsOpen ? '' : ' hide'}`}>
          <div>Enter the command you use to compile/run this type of file and press enter.</div>
          <form onSubmit={this.setCommand}>
            <input
              placeholder="command"
              type="text"
              value={modalValue}
              onChange={this.handleModalChange}
            />
            <button onClick={doCloseModal}>Cancel</button>
          </form>
        </div>
      </div>
    );
  }
}

Terminal.propTypes = {
  REPLIsOpen: PropTypes.bool.isRequired,
  modalIsOpen: PropTypes.bool.isRequired,
  commands: PropTypes.shape({
    c: PropTypes.string.isRequired,
  }).isRequired,
  activeFilePath: PropTypes.string.isRequired,
  doOpenREPL: PropTypes.func.isRequired,
  doCloseREPL: PropTypes.func.isRequired,
  doOpenModal: PropTypes.func.isRequired,
  doCloseModal: PropTypes.func.isRequired,
  doSetCommand: PropTypes.func.isRequired,
};
