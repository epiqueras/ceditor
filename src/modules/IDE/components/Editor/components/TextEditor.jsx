/* global window */
/* global document */
import React, { Component, PropTypes } from 'react';
import CodeMirror from 'codemirror';
import { ipcRenderer, remote } from 'electron';
import sysPath from 'path';

import '../codeMirrorDeps';

const { dialog } = remote;

export default class TextEditor extends Component {
  constructor(props) {
    super(props);
    this.cmContainer = {};
    this.myCodeMirror = {};
    this.setupFileDrop = this.setupFileDrop.bind(this);
    this.setRef = this.setRef.bind(this);
    this.getOpenFile = this.getOpenFile.bind(this);
    this.createUntitled = this.createUntitled.bind(this);
    this.updateBackground = this.updateBackground.bind(this);
    this.detectMode = this.detectMode.bind(this);
    const {
      openFiles,
      doChangeTheme,
      doSetUnsavedChanges,
      doSaveAs,
      doChangeActiveFile,
      doOpenFile,
      doStoreDoc,
      doAddTab,
    } = this.props;
    // Respond to application menu commands
    ipcRenderer.on('themeChanges', (event, theme) => doChangeTheme(theme));
    ipcRenderer.on('newFile', () => this.createUntitled());
    ipcRenderer.on('openFile', () => {
      const openFilePaths = dialog.showOpenDialog(remote.getCurrentWindow(), { title: 'Open File', properties: ['openFile', 'createDirectory'] });
      if (openFilePaths && openFilePaths.length === 1) {
        const path = openFilePaths[0];
        const name = path.slice(path.lastIndexOf(sysPath.sep) + 1);
        if (!this.props.openFiles.find(file => file.path === path)) { // If it's not open, open it
          doOpenFile(name, path);
          doAddTab(name, path);
        } else doChangeActiveFile(path); // If it's open, switch to it
      }
    });
    ipcRenderer.on('save', () => {
      const { path } = this.getOpenFile();
      if (path.slice(0, 11) !== '-$untitled-') doSetUnsavedChanges(path, false, true, this.myCodeMirror.getValue());
      else {
        const openFilePath = dialog.showSaveDialog(remote.getCurrentWindow(), { title: 'Save As' });
        if (openFilePath) {
          const value = this.myCodeMirror.getValue();
          doStoreDoc(path, value, JSON.stringify(this.myCodeMirror.getHistory()));
          doSaveAs(path, openFilePath, value);
        }
      }
    });
    ipcRenderer.on('saveAs', () => {
      const openFilePath = dialog.showSaveDialog(remote.getCurrentWindow(), { title: 'Save As' });
      if (openFilePath) {
        const { path } = this.getOpenFile();
        const value = this.myCodeMirror.getValue();
        doStoreDoc(path, value, JSON.stringify(this.myCodeMirror.getHistory()));
        doSaveAs(path, openFilePath, value);
      }
    });

    // Create a new untitled file if no files are open
    const { id, initialFilePath } = remote.getCurrentWindow();
    if (initialFilePath) {
      const name = initialFilePath.slice(initialFilePath.lastIndexOf(sysPath.sep) + 1);
      doOpenFile(name, initialFilePath);
      doAddTab(name, initialFilePath);
      ipcRenderer.sendSync('clearInitialFilePath', id);
    } else if (openFiles.length === 0) this.createUntitled();
  }

  componentDidMount() {
    const { theme } = this.props;
    // Initialize CodeMirror instance
    this.myCodeMirror = CodeMirror(this.cmContainer, {
      value: this.getOpenFile() ? this.getOpenFile().value : '',
      theme,
      mode: 'text/x-textile',
      indentUnit: 2,
      smartIndent: true,
      tabSize: 2,
      indentWithTabs: false,
      electricChars: true,
      keyMap: 'sublime',
      lineWrapping: false,
      lineNumbers: true,
      fixedGutter: true,
      matchBrackets: true,
      autoCloseBrackets: { pairs: `()[]{}''""`, explode: `()[]{}''""` }, // eslint-disable-line quotes
      matchTags: true,
      showTrailingSpace: true,
      autoCloseTags: true,
      foldGutter: true,
      gutters: ['CodeMirror-lint-markers', 'CodeMirror-foldgutter'],
      highlightSelectionMatches: true,
      lint: true,
      styleSelectedText: true,
      styleActiveLine: true,
      selectionPointer: true,
      continueComments: true,
      scrollbarStyle: 'simple',
    });

    const { doSetUnsavedChanges } = this.props;
    this.myCodeMirror.setOption('extraKeys', {
      'Ctrl-Space': () => this.myCodeMirror.showHint(),
    });

    // Set unsaved changes on file tab when changes are made to the document
    this.myCodeMirror.on('changes', (instance, changes) => {
      if (changes[0].origin !== 'setValue') {
        const { path } = this.getOpenFile();
        doSetUnsavedChanges(path, true);
      }
    });
    this.setupFileDrop(); // Sets up drag and dropping files into the editor
    this.updateBackground(); // Sets the background color to the editor's theme background color
  }

  componentDidUpdate(prevProps) {
    const { activeFilePath: prevFilePath, theme: prevTheme } = prevProps;
    const { activeFilePath, openFiles, theme, doStoreDoc } = this.props;
    if (!activeFilePath) { // If all files have been closed, open a new one
      this.createUntitled();
    } else if (prevFilePath !== activeFilePath) { // New file loaded
      const { value, history } = this.getOpenFile();
      // Store the previous file if it exists
      if (prevFilePath && openFiles.find(file => file.path === prevFilePath)) {
        doStoreDoc(prevFilePath,
          this.myCodeMirror.getValue(), JSON.stringify(this.myCodeMirror.getHistory()));
      }
      this.myCodeMirror.setValue(value);
      // Set the history if the new file has one, otherwise clear it
      if (history) this.myCodeMirror.setHistory(JSON.parse(history));
      else this.myCodeMirror.clearHistory();

      this.detectMode();
    }

    // Change the theme and update the background if the theme has changed
    if (prevTheme !== theme) {
      this.myCodeMirror.setOption('theme', theme);
      this.updateBackground();
    }
  }

  setupFileDrop() {
    const { doChangeActiveFile, doOpenFile, doAddTab } = this.props;
    const fileDrop = document.getElementById('file-drop');
    fileDrop.ondragover = fileDrop.ondragleave = fileDrop.ondragend = () => false;
    fileDrop.ondrop = (event) => {
      event.preventDefault();
      if (event.dataTransfer.files.length > 0) { // Check if it's a file
        const { name, path } = event.dataTransfer.files[0];
        if (!this.props.openFiles.find(file => file.path === path)) { // If it's not open, open it
          doOpenFile(name, path);
          doAddTab(name, path);
        } else doChangeActiveFile(path); // If it's open, switch to it
      }
      return false;
    };
  }

  // Sets the ref to the CodeMirror container
  setRef(c) {
    this.cmContainer = c;
  }

  getOpenFile() {
    const { openFiles, activeFilePath } = this.props;
    return openFiles.find(file => file.path === activeFilePath);
  }

  createUntitled() {
    const { openFiles, doCreateNewFile, doSetUnsavedChanges, doAddTab } = this.props;
    // Generate an untitled name and path depending on how
    // many untitled files are open to avoid path collisions
    let untitledNum = openFiles.reduce((count, file) => file.path.slice(0, 11) === '-$untitled-' ? count + 1 : count, 0);
    untitledNum = untitledNum < 1 ? '' : untitledNum + 1;
    const fileName = `untitled${untitledNum}`;
    const filePath = `-$untitled-${untitledNum}`;
    doCreateNewFile(fileName, filePath);
    doAddTab(fileName, filePath);
    doSetUnsavedChanges(filePath, true); // Untitled files are unsaved
  }

  updateBackground() {
    const { backgroundColor } = window.getComputedStyle(this.cmContainer.firstChild);
    document.getElementsByClassName('file-tabs-container CodeMirror')[0].style.backgroundColor = backgroundColor;
    document.body.style.backgroundColor = backgroundColor;
  }

  detectMode() {
    const { path } = this.getOpenFile();
    const fileExt = path.slice(path.lastIndexOf('.'));
    if (fileExt) {
      switch (fileExt) {
        case '.js':
          this.myCodeMirror.setOption('mode', 'text/javascript');
          break;
        case '.c':
          this.myCodeMirror.setOption('mode', 'text/x-csrc');
          break;
        case '.cpp':
          this.myCodeMirror.setOption('mode', 'text/x-c++src');
          break;
        case '.java':
          this.myCodeMirror.setOption('mode', 'text/x-java');
          break;
        case '.cs':
          this.myCodeMirror.setOption('mode', 'text/x-csharp');
          break;
        case '.m':
          this.myCodeMirror.setOption('mode', 'text/x-objectivec');
          break;
        case '.py':
          this.myCodeMirror.setOption('mode', 'text/x-python');
          break;
        default:
          break;
      }
    }
  }

  render() {
    return (
      <div id="file-drop" className="editor">
        <div ref={this.setRef} />
      </div>
    );
  }
}

TextEditor.propTypes = {
  theme: PropTypes.string.isRequired,
  activeFilePath: PropTypes.string.isRequired,
  openFiles: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
      history: PropTypes.string.isRequired,
    }),
  ).isRequired,
  doChangeTheme: PropTypes.func.isRequired,
  doChangeActiveFile: PropTypes.func.isRequired,
  doCreateNewFile: PropTypes.func.isRequired,
  doOpenFile: PropTypes.func.isRequired,
  doStoreDoc: PropTypes.func.isRequired,
  doSetUnsavedChanges: PropTypes.func.isRequired,
  doSaveAs: PropTypes.func.isRequired,
  doAddTab: PropTypes.func.isRequired,
};
