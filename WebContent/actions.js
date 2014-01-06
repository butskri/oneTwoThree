logForDebugging = function(msg) {
	console.log(msg);
};

function shuffle(array) {
    var counter = array.length, temp, index;

    // While there are elements in the array
    while (counter--) {
        // Pick a random index
        index = (Math.random() * counter) | 0;

        // And swap the last element with it
        temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

    return array;
}

var exercises = shuffle(new Array("exercise1", "exercise2", "exercise3", "exercise3b", "exercise4", "exercise4b",
		"exercise5", "exercise5b", "exercise6", "exercise6b", "exercise7", "exercise7b", "exercise8", "exercise8b",
		"exercise9", "exercise9b", "exercise10", "exercise10b", "exercise11", "exercise11b", "exercise12", "exercise12b",
		"exercise13", "exercise13b", "exercise14", "exercise14b", "exercise15", "exercise15b", "exercise16", "exercise16b",
		"exercise16c", "exercise16d"));

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

createExercise = function(theExerciseName) {
	var exerciseName = theExerciseName;
	var answers = null;

	$.getJSON(exerciseName + '/exercise.json', function(data) {
		$('#title').html(data.question);
		if (data.questionImage) {
			$('#questionImage').attr('src', data.questionImage);
			$('#questionImageDiv').show();
		} else {
			$('#questionImageDiv').hide();
		}
		answers = createAnswers(exerciseName, data);
	}, function() {});

	selectAnswer = function(newSelectedAnswer) {
		answers.selectAnswer(newSelectedAnswer);
	};

	isRightAnswerSelected = function() {
		return answers.isRightAnswerSelected();
	};

	playQuestion = function() {
		SOUNDS.playSound(questionSound());
	};

	questionSound = function() {
		return exerciseName + '/question.mp3';
	};

	return {
		isRightAnswerSelected : isRightAnswerSelected,
		selectAnswer : selectAnswer,
		playQuestion : playQuestion
	};
};

createAnswers = function(exerciseName, exerciseData) {
	possibleAnswerImages = function(exerciseName, exerciseData) {
		if (exerciseData.possibleAnswers) {
			return exerciseData.possibleAnswers;
		}
		return new Array(exerciseName + '/1.png', exerciseName + '/2.png',exerciseName + '/3.png',exerciseName + '/4.png');
	};
	
	setUpAnswers = function() {
		possibleAnswerImages = shuffle(possibleAnswerImages);
		setUpAnswerImageFor(1);
		setUpAnswerImageFor(2);
		setUpAnswerImageFor(3);
		setUpAnswerImageFor(4);
	};
	
	setUpAnswerImageFor = function(answerNumber) {
		$(answerIdFor(answerNumber)).attr('src', getAnswerImage(answerNumber));
	};
	
	getAnswerImage = function(imageNumber) {
		return possibleAnswerImages[imageNumber - 1];
	};
	
	isRightAnswerSelected = function() {
		if (selectedAnswer == 0) {
			return false;
		}
		return rightAnswer == getAnswerImage(selectedAnswer);
	};
	
	selectAnswer = function(newSelectedAnswer) {
		selectedAnswer = newSelectedAnswer;
	};

	var possibleAnswerImages = possibleAnswerImages(exerciseName, exerciseData);
	var rightAnswer = getAnswerImage(exerciseData.rightAnswer);
	var selectedAnswer = 0;
	setUpAnswers();
	
	return {
		isRightAnswerSelected : isRightAnswerSelected,
		selectAnswer : selectAnswer
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
		resetSelectedAnswers();
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
		resetSelectedAnswers();
		currentExercise.selectAnswer(answerNumber);
		addCssClassSelectedFor(answerNumber);
	};
	
	resetSelectedAnswers = function() {
		removeCssClassSelectedFor(1);
		removeCssClassSelectedFor(2);
		removeCssClassSelectedFor(3);
		removeCssClassSelectedFor(4);
		resetBody();
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
