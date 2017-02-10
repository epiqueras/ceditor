export const OPEN_REPL = 'OPEN_REPL';
export const CLOSE_REPL = 'CLOSE_REPL';
export const OPEN_MODAL = 'OPEN_MODAL';
export const CLOSE_MODAL = 'CLOSE_MODAL';
export const SET_COMMAND = 'SET_COMMAND';

export function openREPL() {
  return {
    type: OPEN_REPL,
  };
}

export function closeREPL() {
  return {
    type: CLOSE_REPL,
  };
}

export function openModal() {
  return {
    type: OPEN_MODAL,
  };
}

export function closeModal() {
  return {
    type: CLOSE_MODAL,
  };
}

export function setCommand(commandType, command) {
  return {
    type: SET_COMMAND,
    commandType,
    command,
  };
}
