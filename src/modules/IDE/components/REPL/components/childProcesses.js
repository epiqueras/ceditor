/* global document */
import { spawn, spawnSync, fork } from 'child_process';

export function appendOutput(data, outputRef, inputRef, cssClasses = '') {
  const dataArray = data.toString('utf8').split('\n');
  const firstText = document.createElement('span');
  if (cssClasses) firstText.className = cssClasses;
  firstText.textContent = cssClasses === 'savedInput' ? dataArray[0].slice(2) : dataArray[0];
  outputRef.insertBefore(firstText, inputRef);

  for (let i = 1; i < dataArray.length; i += 1) {
    const lineBreak = document.createElement('br');
    outputRef.insertBefore(lineBreak, inputRef);

    const text = document.createElement('span');
    if (cssClasses) text.className = cssClasses;
    text.textContent = cssClasses === 'savedInput' ? dataArray[i].slice(2) : dataArray[i];
    outputRef.insertBefore(text, inputRef);
  }

  const outputDiv = document.getElementsByClassName('output')[0];
  outputDiv.scrollTop = outputDiv.scrollHeight;
}

export default function runChildProcess(command, outputRef, inputRef) {
  if (command.compileCmd) {
    const compilation = spawnSync(
      command.compileCmd,
      command.compileArgs,
      { cwd: command.cwd },
    );
    appendOutput(`${compilation.stderr}\n`, outputRef, inputRef, 'error');
    if (compilation.error) return { error: compilation.error };
  }

  if (command.message) appendOutput(command.message, outputRef, inputRef, 'message');

  let cp;
  if (command.message.slice(0, 4) === 'node') {
    cp = fork(command.cmd, command.args, { cwd: command.cwd, silent: true });
  } else {
    cp = spawn(command.cmd, command.args, { cwd: command.cwd });
  }

  cp.stdout.on('data', (data) => {
    appendOutput(data, outputRef, inputRef);
  });

  cp.stderr.on('data', (data) => {
    appendOutput(data, outputRef, inputRef, 'error');
  });

  return cp;
}
