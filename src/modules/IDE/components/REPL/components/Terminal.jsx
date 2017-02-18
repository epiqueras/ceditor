/* global window */
/* global document */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { Component, PropTypes } from 'react';
import { remote } from 'electron';
import sysPath from 'path';

import runChildProcess, { appendOutput } from './childProcesses';
import SettingsModal from './SettingsModal';

const { dialog } = remote;

export default class Terminal extends Component {
  constructor(props) {
    super(props);
    this.inputRef = {};
    this.cp = false;
    this.setCaretToEnd = this.setCaretToEnd.bind(this);
    this.setInputRef = this.setInputRef.bind(this);
    this.setOutputRef = this.setOutputRef.bind(this);
    this.openREPL = this.openREPL.bind(this);
    this.closeREPL = this.closeREPL.bind(this);
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

  openREPL() {
    const { activeFilePath, commands, doOpenREPL, doOpenModal } = this.props;
    const currentDirectory = activeFilePath.slice(0, activeFilePath.lastIndexOf(sysPath.sep) + 1);
    const fileName = activeFilePath.slice(activeFilePath.lastIndexOf(sysPath.sep) + 1);
    const cleanFileName = fileName.slice(0, fileName.lastIndexOf('.'));
    const fileExt = fileName.slice(fileName.lastIndexOf('.'));
    const command = { cmd: '', args: [], compileCmd: '', compileArgs: [], cwd: '', message: '' };

    switch (fileExt) {
      case '.js':
        if (!commands.js) return doOpenModal();
        command.cmd = `${activeFilePath}`;
        command.message = 'node process\n\n';
        break;
      case '.c':
        if (!commands.c) return doOpenModal();
        command.compileCmd = commands.c;
        command.compileArgs = ['-o', `${cleanFileName}.exe`, fileName];
        command.cmd = `${currentDirectory}${cleanFileName}.exe`;
        command.cwd = currentDirectory;
        command.message = "C: If you're having trouble with output buffering, copy this above your main function:\nsetvbuf(stdout, NULL, _IONBF, 0);\n\n";
        if (commands.c === 'bcc32') commands.compileArgs = [`-e${cleanFileName}.exe`, fileName];
        break;
      case '.cpp':
        if (!commands.cpp) return doOpenModal();
        command.compileCmd = commands.cpp;
        command.compileArgs = ['-o', `${cleanFileName}.exe`, fileName];
        command.cmd = `${currentDirectory}${cleanFileName}.exe`;
        command.cwd = currentDirectory;
        command.message = "C++: If you're having trouble with output buffering, copy this above your main function:\nsetvbuf(stdout, NULL, _IONBF, 0);\n\n";
        if (commands.cpp === 'bcc32') commands.compileArgs = [`-e${cleanFileName}.exe`, fileName];
        break;
      case '.java':
        if (!commands.java) return doOpenModal();
        command.compileCmd = commands.java;
        command.compileArgs = [fileName];
        command.cmd = 'java';
        command.args = [cleanFileName];
        command.cwd = currentDirectory;
        command.message = 'java\n\n';
        break;
      case '.py':
        command.cmd = 'python';
        command.args = ['-u', activeFilePath];
        command.message = 'python\n\n';
        break;
      default:
        return dialog.showMessageBox(remote.getCurrentWindow(), { message: 'Unsupported file type.' });
    }

    this.outputRef.innerHTML = '';
    this.outputRef.appendChild(this.inputRef);
    doOpenREPL();
    this.cp = runChildProcess(command, this.outputRef, this.inputRef);
    if (!this.cp.on) return dialog.showMessageBox(remote.getCurrentWindow(), { message: 'Could not find compiler/build tool for this file type in path.' });
    this.cp.on('close', (code) => {
      appendOutput(`\nchild process exited with code ${code}\n`, this.outputRef, this.inputRef);
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

  toStdin(event) {
    if (event.keyCode === 13) {
      appendOutput(`${this.inputRef.textContent}\n`, this.outputRef, this.inputRef, 'savedInput');
      if (!this.cp) appendOutput('Child process already exited, please rerun your code.\n', this.outputRef, this.inputRef, 'error');
      else this.cp.stdin.write(`${this.inputRef.textContent.slice(2)}\n`, 'utf8');
      this.setCaretToEnd();
    }
    if (event.keyCode === 8 && this.inputRef.textContent.length <= 2) {
      this.setCaretToEnd();
    }
  }

  render() {
    const {
      REPLIsOpen,
      modalIsOpen,
      commands,
      doOpenModal,
      doCloseModal,
      doSetCommands,
    } = this.props;
    return (
      <div className="repl-container">
        <button onClick={doOpenModal} className={`compiler-settings${modalIsOpen ? ' modal-open' : ''}`}>
          <i className="material-icons">settings</i>
        </button>
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
          <SettingsModal
            commands={commands}
            doCloseModal={doCloseModal}
            doSetCommands={doSetCommands}
          />
        </div>
      </div>
    );
  }
}

Terminal.propTypes = {
  REPLIsOpen: PropTypes.bool.isRequired,
  modalIsOpen: PropTypes.bool.isRequired,
  commands: PropTypes.shape({
    js: PropTypes.string.isRequired,
    c: PropTypes.string.isRequired,
    cpp: PropTypes.string.isRequired,
    java: PropTypes.string.isRequired,
    python: PropTypes.string.isRequired,
  }).isRequired,
  activeFilePath: PropTypes.string.isRequired,
  doOpenREPL: PropTypes.func.isRequired,
  doCloseREPL: PropTypes.func.isRequired,
  doOpenModal: PropTypes.func.isRequired,
  doCloseModal: PropTypes.func.isRequired,
  doSetCommands: PropTypes.func.isRequired,
};
