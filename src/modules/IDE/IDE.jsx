import React from 'react';

import FileTabs from './components/FileTabs/FileTabs';
import Editor from './components/Editor/Editor';

const IDE = () => (
  <div className="ide-root">
    <FileTabs />
    <Editor />
  </div>
);

export default IDE;
