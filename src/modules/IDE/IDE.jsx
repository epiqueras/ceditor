import React from 'react';

import REPL from './components/REPL/REPL';
import FileTabs from './components/FileTabs/FileTabs';
import Editor from './components/Editor/Editor';

const IDE = () => (
  <div className="ide-root">
    <REPL />
    <FileTabs />
    <Editor />
  </div>
);

export default IDE;
