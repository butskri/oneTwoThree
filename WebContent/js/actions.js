logForDebugging = function(msg) {
	console.log(msg);
};


createExercise = function(exerciseName) {
	var name = exerciseName;
	var question = 'defaultQuestion';
	var selectedAnswer = 1;
	var rightAnswer = 1;
	
	isRightAnswerSelected = function() {
	  return rightAnswer == selectedAnswer;
	};
	
	withQuestion = function(newQuestion) {
		question = newQuestion;
		return this;
	};
	
	withRightAnswer = function(newRightAnswer) {
		rightAnswer = newRightAnswer;
		return this;
	};
	
	setUp = function() {
		$('#question').html(question);
		setUpAnswerImageFor(1);
		setUpAnswerImageFor(2);
		setUpAnswerImageFor(3);
		setUpAnswerImageFor(4);
	};
	
	setUpAnswerImageFor = function(answerNumber) {
		$(answerIdFor(answerNumber)).attr('src', answerImageFor(answerNumber));
	};
	
	answerImageFor = function(answerNumber) {
		return 'img/' + name + '/' + answerNumber + '.png';
	};
	
	selectAnswer = function(newSelectedAnswer) {
		selectedAnswer = newSelectedAnswer;
	};
	
	return {
		setUp: setUp,
		withQuestion: withQuestion,
		withRightAnswer: withRightAnswer,
		isRightAnswerSelected: isRightAnswerSelected,
		selectAnswer: selectAnswer
	};
};

var APP = (function() {
	var currentExercise = null;
	
	setUp = function() {
      logForDebugging('setting up app');
	  currentExercise = createExercise('exercise1');
      logForDebugging('created exercise: ' + currentExercise);
	  currentExercise.withQuestion('Waar zie je het getal drie?');
	  currentExercise.withRightAnswer(3);
	  currentExercise.setUp();
	  setUpPossibleAnswers();
	};
	
	setUpPossibleAnswers = function() {
		attachListenerForAnswerNumber(1);
		attachListenerForAnswerNumber(2);
		attachListenerForAnswerNumber(3);
		attachListenerForAnswerNumber(4);
	};

	attachListenerForAnswerNumber = function(answerNumber) {
		$(answerIdFor(answerNumber)).click(function() { APP.selectAnswer(answerNumber); });
	};

	selectAnswer = function(answerNumber) {
		logForDebugging('answer selected: ' + answerNumber);
		currentExercise.selectAnswer(answerNumber);
		removeCssClassSelectedFor(1);
		removeCssClassSelectedFor(2);
		removeCssClassSelectedFor(3);
		removeCssClassSelectedFor(4);
		addCssClassSelectedFor(answerNumber);
	};

	removeCssClassSelectedFor = function(answerNumber) {
		$(answerIdFor(answerNumber)).removeClass('selected');
	};

	addCssClassSelectedFor = function(answerNumber) {
		$(answerIdFor(answerNumber)).addClass('selected');
	};

	checkAnswer = function() {
		if (currentExercise.isRightAnswerSelected()) {
			SOUNDS.playSoundRightAnswer();
		} else {
			SOUNDS.playSoundWrongAnswer();
		}
	};
	
	return {
		currentExercise: currentExercise,
		setUp: setUp,
		selectAnswer: selectAnswer,
		checkAnswer: checkAnswer
	};
})();

var SOUNDS = (function() {
	playSoundRightAnswer = function() {
		playSound('../sounds/Ellen-Bravo.mp3');
	};

	playSoundWrongAnswer = function() {
		playSound('../sounds/1_Wrong buzzer.mp3');
	};

	playSound = function(srcGeluid) {
		var sound = new Audio();
		sound.src = srcGeluid;
	    sound.play();
		logForDebugging('played ' + srcGeluid + '!');
	};
	
	return {
		playSoundRightAnswer: playSoundRightAnswer,
		playSoundWrongAnswer: playSoundWrongAnswer
	};
})();


answerIdFor = function(answerNumber) {
	return '#answer' + answerNumber;
};

initializeApp = function() {
  logForDebugging('starting app...');
  $('#valideren').click(APP.checkAnswer);
  APP.setUp();
};

$(initializeApp);

