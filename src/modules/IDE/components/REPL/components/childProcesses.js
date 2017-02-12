/* global document */
import { spawn, spawnSync, fork } from 'child_process';

export function appendOutput(data, outputRef, inputRef) {
  const dataArray = data.toString('utf8').split('\n');
  const firstText = document.createElement('span');
  firstText.textContent = dataArray[0];
  outputRef.insertBefore(firstText, inputRef);

  for (let i = 1; i < dataArray.length; i += 1) {
    const lineBreak = document.createElement('br');
    outputRef.insertBefore(lineBreak, inputRef);

    const text = document.createElement('span');
    text.textContent = dataArray[i];
    outputRef.insertBefore(text, inputRef);
  }
}

export default function runChildProcess(command, outputRef, inputRef) {
  if (command.compileCmd) {
    const compilation = spawnSync(
      command.compileCmd,
      command.compileArgs,
      { cwd: command.cwd },
    );
    appendOutput(`${compilation.stderr}\n`, outputRef, inputRef);
    if (compilation.error) return { error: compilation.error };
  }

  if (command.message) appendOutput(command.message, outputRef, inputRef);

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
    appendOutput(data, outputRef, inputRef);
  });

  return cp;
}
