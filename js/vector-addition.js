/*
  Vector addition demo (plain JavaScript + SVG, no libraries and no internet needed).
  Looks for <div id="vector-demo"> on the page.
  To change the range of the random numbers, edit MAX_LENGTH below.
*/
(function () {
  var root = document.getElementById('vector-demo');
  if (!root) return;

  var MAX_LENGTH = 5;                 // each vector is a random whole number from 1 to this
  var NS = 'http://www.w3.org/2000/svg';
  var AXIS_MAX = 2 * MAX_LENGTH;      // the number line always runs from 0 to the largest possible sum
  var W = 600, X0 = 30, Y = 150;      // drawing area width, left edge, baseline height
  var U = (W - 2 * X0) / AXIS_MAX;    // pixels per unit, the same for every example
  var stage = root.querySelector('.stage');
  var eq = root.querySelector('.eq');
  var buttons = root.querySelectorAll('button');
  var a = 3, b = 4;
  var step = 0;       // which step is currently showing (0 = nothing)
  var unlocked = 0;   // how many steps the student has viewed, in order, for this example

  function make(name, attrs, text) {
    var e = document.createElementNS(NS, name);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (text !== undefined) e.textContent = String(text);
    stage.appendChild(e);
  }
  function arrow(x1, x2, y, color) {
    make('line', { x1: x1, y1: y, x2: x2, y2: y, 'class': 'vec ' + color, 'marker-end': 'url(#head-' + color + ')' });
  }
  function label(text, x, y, color) {
    make('text', { x: x, y: y, 'class': 'vlabel ' + color }, text);
  }

  function render() {
    while (stage.firstChild) stage.removeChild(stage.firstChild);
    var total = a + b;
    var u = U;

    make('line', { x1: X0, y1: Y + 14, x2: X0 + AXIS_MAX * u, y2: Y + 14, 'class': 'axis' });
    for (var i = 0; i <= AXIS_MAX; i++) {
      make('line', { x1: X0 + i * u, y1: Y + 8, x2: X0 + i * u, y2: Y + 20, 'class': 'axis' });
      make('text', { x: X0 + i * u, y: Y + 38, 'class': 'tick' }, i);
    }
    if (step >= 1) { arrow(X0, X0 + a * u, Y, 'g'); label(a, X0 + a * u / 2, Y - 14, 'g'); }
    if (step >= 2) { arrow(X0 + a * u, X0 + total * u, Y, 'b'); label(b, X0 + a * u + b * u / 2, Y - 14, 'b'); }
    if (step >= 3) { arrow(X0, X0 + total * u, Y - 70, 'r'); label(total, X0 + total * u / 2, Y - 84, 'r'); }

    // The equation is revealed one piece at a time, matching the step on screen
    if (step === 1) eq.textContent = String(a);
    else if (step === 2) eq.textContent = a + ' + ' + b;
    else if (step === 3) eq.textContent = a + ' + ' + b + ' = ' + total;
    else eq.textContent = '';

    // A step button works only if it is the next unviewed step (or any step once all three were viewed)
    for (var j = 0; j < buttons.length; j++) {
      var action = Number(buttons[j].getAttribute('data-action'));
      if (action >= 1 && action <= 3) buttons[j].disabled = action > unlocked + 1;
    }
  }

  function newExample() {
    a = 1 + Math.floor(Math.random() * MAX_LENGTH);
    b = 1 + Math.floor(Math.random() * MAX_LENGTH);
    step = 0;
    unlocked = 0;
  }

  for (var i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', function (event) {
      var action = event.currentTarget.getAttribute('data-action');
      if (action === 'new') newExample();
      else {
        var n = Number(action);          // 0 = reset, 1/2/3 = steps
        if (n > unlocked + 1) return;    // this step is still locked
        step = n;
        if (n > unlocked) unlocked = n;
      }
      render();
    });
  }

  render();
})();
