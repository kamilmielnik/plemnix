import 'babel-polyfill';
import 'node-normalize-scss/_normalize.scss';
import 'styles/main.scss';
import FastClick from 'fastclick';

FastClick.attach(document.body);
main();

function main() {
  alert('ready');
}
