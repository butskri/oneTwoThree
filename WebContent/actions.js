var exercises = new Array("exercise1", "exercise2");

logForDebugging = function(msg) {
	console.log(msg);
};

var SOUNDS = (function() {
	playSoundRightAnswer = function() {
		playSound('sounds/GoedGedaanHanne.mp3');
	};

	playSoundWrongAnswer = function() {
		playSound('sounds/WrongBuzzer.mp3');
	};

	playSound = function(srcGeluid) {
		var sound = new Audio();
		sound.src = srcGeluid;
		sound.play();
		logForDebugging('played ' + srcGeluid + '!');
	};

	return {
		playSoundRightAnswer : playSoundRightAnswer,
		playSoundWrongAnswer : playSoundWrongAnswer,
		playSound : playSound
	};
})();

createExercise = function(exerciseName) {
	var name = exerciseName;
	var question = 'undefined';
	var rightAnswer = 0;
	var selectedAnswer = 1;

	$.getJSON(name + '/exercise.json', function(data) {
		question = data.question;
		rightAnswer = data.rightAnswer;
		setUp();
	}, function() {
	});

	isRightAnswerSelected = function() {
		return rightAnswer == selectedAnswer;
	};

	playQuestion = function() {
		SOUNDS.playSound(getQuestionSound());
	};

	getQuestionSound = function() {
		return name + '/question.mp3';
	};

	setUp = function() {
		$('#title').html(question);
		setUpAnswerImageFor(1);
		setUpAnswerImageFor(2);
		setUpAnswerImageFor(3);
		setUpAnswerImageFor(4);
	};

	setUpAnswerImageFor = function(answerNumber) {
		$(answerIdFor(answerNumber)).attr('src', answerImageFor(answerNumber));
	};

	answerImageFor = function(answerNumber) {
		return name + '/' + answerNumber + '.png';
	};

	selectAnswer = function(newSelectedAnswer) {
		selectedAnswer = newSelectedAnswer;
	};

	return {
		isRightAnswerSelected : isRightAnswerSelected,
		selectAnswer : selectAnswer,
		playQuestion : playQuestion
	};
};

var APP = (function() {
	var exerciseIndex = 0;
	var currentExercise = null;

	setUp = function() {
		logForDebugging('setting up app');
		setUpPossibleAnswers();
		setUpCurrentExercise();
	};
	
	setUpCurrentExercise = function() {
		setUpExercise(exercises[exerciseIndex]);
	};

	setUpExercise = function(name) {
		currentExercise = createExercise(name);
		APP.selectAnswer(1);
		playQuestionSound();
	};

	playQuestionSound = function() {
		currentExercise.playQuestion();
	};

	setUpPossibleAnswers = function() {
		attachListenerForAnswerNumber(1);
		attachListenerForAnswerNumber(2);
		attachListenerForAnswerNumber(3);
		attachListenerForAnswerNumber(4);
	};

	attachListenerForAnswerNumber = function(answerNumber) {
		$(answerIdFor(answerNumber)).click(function() {
			APP.selectAnswer(answerNumber);
		});
	};

	selectAnswer = function(answerNumber) {
		logForDebugging('answer selected: ' + answerNumber);
		currentExercise.selectAnswer(answerNumber);
		removeCssClassSelectedFor(1);
		removeCssClassSelectedFor(2);
		removeCssClassSelectedFor(3);
		removeCssClassSelectedFor(4);
		addCssClassSelectedFor(answerNumber);
		showValidateButton();
	};

	removeCssClassSelectedFor = function(answerNumber) {
		$(answerIdFor(answerNumber)).removeClass('selected');
	};

	addCssClassSelectedFor = function(answerNumber) {
		$(answerIdFor(answerNumber)).addClass('selected');
	};

	checkAnswer = function() {
		if (currentExercise.isRightAnswerSelected()) {
			rightAnswerWasSelected();
		} else {
			wrongAnswerWasSelected();
		}
	};

	showValidateButton = function() {
		resetBody();
		$('#validateButton').show();
	};

	rightAnswerWasSelected = function() {
		resetBody();
		$('body').addClass('right');
		SOUNDS.playSoundRightAnswer();
	};

	wrongAnswerWasSelected = function() {
		resetBody();
		$('body').addClass('wrong');
		SOUNDS.playSoundWrongAnswer();
	};

	resetBody = function() {
		$('body').removeClass('right');
		$('body').removeClass('wrong');
	};

	next = function() {
		exerciseIndex++;
		if (exerciseIndex >= exercises.length) {
			exerciseIndex = 0;
		}
		setUpCurrentExercise();
	};

	previous = function() {
		exerciseIndex--;
		if (exerciseIndex < 0) {
			exerciseIndex = exercises.length - 1;
		}
		setUpCurrentExercise();
	};

	return {
		currentExercise : currentExercise,
		setUp : setUp,
		selectAnswer : selectAnswer,
		checkAnswer : checkAnswer,
		playQuestionSound : playQuestionSound,
		next : next,
		previous : previous
	};
})();

answerIdFor = function(answerNumber) {
	return '#answer' + answerNumber;
};

initializeApp = function() {
	logForDebugging('starting app...');
	$('#validateButton').click(APP.checkAnswer);
	$('#replayQuestion').click(APP.playQuestionSound);
	$('#previousLink').click(APP.previous);
	$('#nextLink').click(APP.next);
	APP.setUp();
};

$(initializeApp);
