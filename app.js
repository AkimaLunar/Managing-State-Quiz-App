// Elements and Templates
// --------------------------------------------------------------------
// Selectors
var questionsProgressElement = '#js-questions-progress';
var titleElement = '#js-title';
var optionsElement ='.js-options';
var controlsElement = '.js-controls';

var startButton = '.js-onStart button';
var resetButton = '.js-onReset button';
var nextButton = '.js-onNext button';
var optionButton = '.option';

// Templates
var optionTemplate = '<li class="option"><button></button></li>';
var startButtonTemplate = '<button type="button" class="button-primary six columns offset-by-three js-onStart" id="" ">Start</button>'
var nextButtonTemplate =  (
  '<p class="three columns offset-by-three controls__helper">' +
    'Pick an answer to move to the next question.' +
  '</p>' +
  '<button type="button" class="three columns js-onNext" id="">Next</button>'
);
var resetButtonTemplate = '<button type="button" class="button-danger six columns offset-by-three js-onReset" id="">Start Over</button>';


// State Management
// --------------------------------------------------------------------
var state = {
  total: QUESTIONS.length,
  first: true,
  final: false,
  counter: 0,
  correct: 0,
  showResult: false,
  answers: []
}

function start(state) {
  state.first = false;
}
function next(state) {
  state.showResult = false;
  state.counter++;
  if (state.counter >= state.total) {
    state.final = true;
  };
}

function check(input, state, questions) {
  state.showResult = true;
  state.answers.push(input);
  if (input === questions[state.counter].correct) {
    state.correct++;
  }
  return {
    input: input,
    correct: questions[state.counter].correct
  }
}

function reset(state) {
  state.first = true;
  state.final = false;
  state.counter = 0;
  state.correct = 0;
  state.showResult = false;
  state.answers = [];
}


// Renderers
// --------------------------------------------------------------------
function renderTotal(state, element){
  console.log('Rendering total');
  if (state.final || state.first) { $(element).html('&nbsp;') }
  else { $(element).html('Question ' + (state.counter+1) + ' out of ' + state.total) }

};
function renderFirst(state, element, controls){
  console.log('Rendering first slide');
  $(element).html('Ready to test your knowledge of Sci-Fi?')
  $(controlsElement).html(startButtonTemplate);
};

function renderOption(option, index){
  console.log('Rendering an option');
  var optionHtml = $(optionTemplate);
  optionHtml.attr('data-option-index', index);
  optionHtml.find('button').text(option);
  return optionHtml;
}

function renderQuestion(state, question, options, controls, questions) {
  console.log('Rendering a question');
  var currentQuestion = questions[state.counter];
  $(question).html(currentQuestion.question);
  var optionsHtml = currentQuestion.options.map(function(option, index){
      return renderOption(option, index);
  })
  $(options).html(optionsHtml);
  $(controlsElement).html(nextButtonTemplate);
};

function renderResult(state, check, options, controls){
  console.log('Rendering result');
  $(options).find('button').attr('disabled', true);
  $(options).find('li[data-option-index="' + check.correct +'"]').addClass('option--correct');
  if (check.input !== check.correct) {
    $(options).find('li[data-option-index="' + check.input +'"]').addClass('option--wrong');
  }
  $(controls).find('.controls__helper').text('');
  $(controls).find('.js-onNext').attr('disabled', false).addClass('button-primary');
  
};

function renderFinal(state, element, controls){
  console.log('Rendering last slide');
  $(element).html('You&rsquo;ve got <strong>' + state.correct + '</strong> right out of ' + state.total +'.');
  $(controlsElement).html(resetButtonTemplate);
};

function emptyOptions(element){
  $(element).empty();
}

function renderQuiz(
    state,
    progressElement,
    titleElement,
    optionsElement,
    controlsElement,
    questions
  ) {
  if (state.first === true) {
    console.log('state.first === true')
    renderTotal(state, progressElement);
    renderFirst(state, titleElement, optionsElement, controlsElement);
    emptyOptions(optionsElement)
  } 
  if (state.final === true) {
    console.log('state.final === true')
    renderTotal(state, progressElement);
    renderFinal(state, titleElement, optionsElement, controlsElement);
    emptyOptions(optionsElement)
  }
  if (state.first === false && state.final === false) {
    console.log('state.first === false && state.final === false')
    renderTotal(state, progressElement);
    renderQuestion(state, titleElement, optionsElement, controlsElement, QUESTIONS);
  }
};

renderQuiz(state, questionsProgressElement, titleElement, optionsElement, controlsElement, QUESTIONS);


// Event Listeners
// --------------------------------------------------------------------

// Controls
$(controlsElement).on('click', $(startButton), function(event){
  event.stopImmediatePropagation();
  console.log('clicked Start');
  start(state);
  renderQuiz(state, questionsProgressElement, titleElement, optionsElement, controlsElement, QUESTIONS);
  console.log(state);
})

$(controlsElement).on('click', $(nextButton), function(event){
  event.stopImmediatePropagation();
  console.log('clicked Next');
  next(state);
  renderQuiz(state, questionsProgressElement, titleElement, optionsElement, controlsElement, QUESTIONS);
})

$(controlsElement).on('click', $(resetButton), function(event){
  event.stopImmediatePropagation();
  console.log('clicked Reset');
  reset(state);
  renderQuiz(state, questionsProgressElement, titleElement, optionsElement, controlsElement, QUESTIONS);
})

// Check
$(optionsElement).on('click', $(optionButton), function(event){
  var currentChoice = parseInt($(event.target).closest('li').attr('data-option-index'));
  var currentCheck = check(currentChoice, state, QUESTIONS);
  console.log(currentCheck.input === currentCheck.correct );
  renderResult(state, currentCheck, optionsElement, controlsElement);
})

// Temporary controls
var tempStartButton = '.js-temp-onStart';
var tempNextButton = '.js-temp-onNext';
var tempResetButton = '.js-temp-onReset';
$(tempStartButton).click(function(event){
  event.stopImmediatePropagation();
  console.log('clicked Start');
  start(state);
  renderQuiz(state, questionsProgressElement, titleElement, optionsElement, controlsElement, QUESTIONS);
  console.log(state);
})

$(tempNextButton).click(function(event){
  event.stopImmediatePropagation();
  console.log('clicked Next');
  next(state);
  renderQuiz(state, questionsProgressElement, titleElement, optionsElement, controlsElement, QUESTIONS);
})

$(tempResetButton).click(function(event){
  event.stopImmediatePropagation();
  console.log('clicked Reset');
  reset(state);
  renderQuiz(state, questionsProgressElement, titleElement, optionsElement, controlsElement, QUESTIONS);
})