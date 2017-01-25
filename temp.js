/* global document */
import $ from 'jquery';
import fullpage from 'fullpage.js'; // eslint-disable-line no-unused-vars
import hljs from 'highlight.js';
import ChildProcess from 'child_process';

// Require Programs
import ArrayShift from './programs/array-shift.js';
import InsCompany from './programs/ins-company.js';
import MathTutor from './programs/math-tutor.js';
import UpperLower from './programs/upper-lower.js';

import './index.scss';

hljs.initHighlightingOnLoad();

const spawn = ChildProcess.spawn;

const arrayShift = ArrayShift.replace('"\n"', '"\\n"').replace("'\n'", "'\\n'");
const insCompany = InsCompany.replace('"\n"', '"\\n"').replace("'\n'", "'\\n'");
const mathTutor = MathTutor.replace('"\n"', '"\\n"').replace("'\n'", "'\\n'");
const upperLower = UpperLower.replace('"\n"', '"\\n"').replace("'\n'", "'\\n'");

function start(commandLine, iText) {
  commandLine.append('Hello how are you\n');
  const child = spawn('./compiled/a.out');
  let childOpen = true;

  child.stdout.on('data', (data) => {
    commandLine.append(`${data}`);
    commandLine.scrollTop(commandLine.prop('scrollHeight'));
  });

  child.stderr.on('data', (data) => {
    commandLine.append(`${data}`);
    commandLine.scrollTop(commandLine.prop('scrollHeight'));
  });

  child.on('close', (code) => {
    childOpen = false;
    commandLine.append(`child process exited with code ${code}\n`);
    commandLine.scrollTop(commandLine.prop('scrollHeight') - commandLine.prop('clientHeight'));
  });

  iText.keyup((e) => {
    if (e.keyCode === 13) {
      if (childOpen) {
        commandLine.append(`${iText.val()}\n`);
        child.stdin.write(`${iText.val()}\n`);
      } else {
        commandLine.append('This process has ended. Please rerun the code\n');
      }
      iText.val('');
      commandLine.scrollTop(commandLine.prop('scrollHeight'));
    }
  });

  return child;
}

$(document).ready(() => {
  const commandLine = $('#command-line');
  const iText = $('#i-text');

  commandLine.click(() => iText.focus());

  $('#fullpage').fullpage({
    menu: '#menu',
    anchors: ['array-shift', 'math-tutor', 'upper-lower', 'ins-company'],
  });
  $.fn.fullpage.setAllowScrolling(false);
  $.fn.fullpage.setKeyboardScrolling(false);
  $('#array-shift-code').text(arrayShift);
  $('#ins-company-code').text(insCompany);
  $('#math-tutor-code').text(mathTutor);
  $('#upper-lower-code').text(upperLower);
  $('pre code').each((i, block) => {
    hljs.highlightBlock(block);
  });

  let currentChild;

  $('.run').click(() => {
    $('.overlay, .close-overlay').removeClass('hidden');
    iText.focus();
    currentChild = start(commandLine, iText);
  });
  $('.close-overlay').click(() => {
    iText.unbind();
    commandLine.text('');
    currentChild.kill();
    $('.overlay, .close-overlay').addClass('hidden');
  });
});
