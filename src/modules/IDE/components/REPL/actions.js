/* global document */
export const OPEN_REPL = 'OPEN_REPL';
export const CLOSE_REPL = 'CLOSE_REPL';
export const OPEN_MODAL = 'OPEN_MODAL';
export const CLOSE_MODAL = 'CLOSE_MODAL';
export const SET_COMMANDS = 'SET_COMMANDS';

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
  document.body.style.pointerEvents = 'none';
  return {
    type: OPEN_MODAL,
  };
}

export function closeModal() {
  document.body.style.pointerEvents = 'auto';
  return {
    type: CLOSE_MODAL,
  };
}

export function setCommands(commandsState) {
  return {
    type: SET_COMMANDS,
    commandsState,
  };
}
