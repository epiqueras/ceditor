/* global window */
/* global document */
import React, { Component, PropTypes } from 'react';
import CodeMirror from 'codemirror';
import { ipcRenderer } from 'electron';

// Modes
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/css/css';
import 'codemirror/mode/htmlmixed/htmlmixed';
import 'codemirror/mode/jsx/jsx';
import 'codemirror/mode/php/php';
import 'codemirror/mode/python/python';
import 'codemirror/mode/swift/swift';
import 'codemirror/mode/clike/clike';

// Keymaps
import 'codemirror/keymap/sublime';

// Addons
// Dialog
import 'codemirror/addon/dialog/dialog';
// Search
import 'codemirror/addon/search/searchcursor';
import 'codemirror/addon/search/search';
import 'codemirror/addon/search/jump-to-line';
import 'codemirror/addon/search/matchesonscrollbar';
import 'codemirror/addon/search/match-highlighter';
// Edit
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/edit/matchtags';
import 'codemirror/addon/edit/trailingspace';
import 'codemirror/addon/edit/closetag';
// Comment
import 'codemirror/addon/comment/comment';
import 'codemirror/addon/comment/continuecomment';
// Fold
import 'codemirror/addon/fold/foldcode';
import 'codemirror/addon/fold/foldgutter';
import 'codemirror/addon/fold/brace-fold';
import 'codemirror/addon/fold/comment-fold';
import 'codemirror/addon/fold/indent-fold';
import 'codemirror/addon/fold/markdown-fold';
import 'codemirror/addon/fold/xml-fold';
// Hint
import 'codemirror/addon/hint/show-hint';
import 'codemirror/addon/hint/anyword-hint';
import 'codemirror/addon/hint/css-hint';
import 'codemirror/addon/hint/html-hint';
import 'codemirror/addon/hint/javascript-hint';
import 'codemirror/addon/hint/sql-hint';
import 'codemirror/addon/hint/xml-hint';
// Lint
import 'codemirror/addon/lint/lint';
import 'codemirror/addon/lint/coffeescript-lint';
import 'codemirror/addon/lint/css-lint';
// import 'codemirror/addon/lint/html-lint';
import 'codemirror/addon/lint/javascript-lint';
import 'codemirror/addon/lint/json-lint';
import 'codemirror/addon/lint/yaml-lint';
// Selection
import 'codemirror/addon/selection/mark-selection';
import 'codemirror/addon/selection/active-line';
import 'codemirror/addon/selection/selection-pointer';
// Scroll
import 'codemirror/addon/scroll/simplescrollbars';
import 'codemirror/addon/scroll/annotatescrollbar';
// Wrap
import 'codemirror/addon/wrap/hardwrap';

export default class TextEditor extends Component {
  constructor(props) {
    super(props);
    const { openFiles, doChangeTheme } = this.props;
    this.cmContainer = {};
    this.myCodeMirror = {};
    this.setupFileDrop = this.setupFileDrop.bind(this);
    this.setRef = this.setRef.bind(this);
    this.getOpenFile = this.getOpenFile.bind(this);
    this.createUntitled = this.createUntitled.bind(this);
    this.updateBackground = this.updateBackground.bind(this);
    ipcRenderer.on('themeChanges', (event, theme) => doChangeTheme(theme));
    ipcRenderer.on('newFile', () => this.createUntitled());
    if (openFiles.length === 0) this.createUntitled();
  }

  componentDidMount() {
    const { theme } = this.props;
    this.myCodeMirror = CodeMirror(this.cmContainer, {
      value: this.getOpenFile() ? this.getOpenFile().value : '',
      theme,
      mode: 'text/x-csrc',
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

    this.myCodeMirror.setOption('extraKeys', {
      'Ctrl-Space': () => this.myCodeMirror.showHint(),
    });
    this.setupFileDrop();
    this.updateBackground();
  }

  componentDidUpdate(prevProps) {
    const { activeFilePath: prevFilePath, theme: prevTheme } = prevProps;
    const { activeFilePath, theme, doStoreDoc } = this.props;
    if (prevFilePath !== activeFilePath) {
      const { value, history } = this.getOpenFile();
      if (prevFilePath) {
        doStoreDoc(prevFilePath,
          this.myCodeMirror.getValue(), JSON.stringify(this.myCodeMirror.getHistory()));
      }
      this.myCodeMirror.setValue(value);
      if (history) this.myCodeMirror.setHistory(JSON.parse(history));
      else this.myCodeMirror.clearHistory();
    }
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
      if (event.dataTransfer.files.length > 0) {
        const { name, path } = event.dataTransfer.files[0];
        if (!this.props.openFiles.find(file => file.path === path)) {
          doOpenFile(name, path);
          doAddTab(name, path);
        } else doChangeActiveFile(path);
      }
      return false;
    };
  }

  setRef(c) {
    this.cmContainer = c;
  }

  getOpenFile() {
    const { openFiles, activeFilePath } = this.props;
    return openFiles.find(file => file.path === activeFilePath);
  }

  createUntitled() {
    const { openFiles, doCreateNewFile, doAddTab } = this.props;
    let untitledNum = openFiles.reduce((count, file) => file.path.slice(0, 11) === '-$untitled-' ? count + 1 : count, 0);
    untitledNum = untitledNum < 1 ? '' : untitledNum + 1;
    const fileName = `untitled${untitledNum}`;
    const filePath = `-$untitled-${untitledNum}`;
    doCreateNewFile(fileName, filePath);
    doAddTab(fileName, filePath);
  }

  updateBackground() {
    const { backgroundColor } = window.getComputedStyle(this.cmContainer.firstChild);
    document.getElementsByClassName('file-tabs-container CodeMirror')[0].style.backgroundColor = backgroundColor;
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
  doAddTab: PropTypes.func.isRequired,
};
