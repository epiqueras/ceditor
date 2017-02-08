export const OPEN_REPL = 'OPEN_REPL';
export const CLOSE_REPL = 'CLOSE_REPL';

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
