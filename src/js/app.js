const stage = () => {
    /*
    stage: start, games, result
    */
    let activeStage = 'start';


    /*
    Variable of games
    */

    const directions = ["up", "right", "down", "left"];
    const gameContainer = document.querySelector("#game-container");
    const scoreElement = document.querySelector("#score");

    let startX = 0;
    let startY = 0;
    let endX = 0;
    let endY = 0;

    let direction;
    let isReverseDirection;

    let score = 0;
    let correct = 0;
    let failed = 0;

    // Progress Bar Countdown Timer

    const progressBarElement = document.querySelector("#progress-bar");
    const gameDuration = 30; // Game Duration in seconds
    const progressBarWidthDenominator = gameDuration * 1000;
    let progressBarWidthNumerator = gameDuration * 1000;
    let progressBarInterval = setInterval(progressBarFrame, 10);

    // set function
    let btnRefresh = document.querySelector('.btn-refresh');


    const lock = (event) => {
        if (!event.target.classList.contains("arrow")) return;
        startX = event.type === "mousedown" ? event.screenX : event.changedTouches[0].screenX;
        startY = event.type === "mousedown" ? event.screenY : event.changedTouches[0].screenY;
    }

    const release = (event) => {
        if (!startX) return;
        endX = event.type === "mouseup" ? event.screenX : event.changedTouches[0].screenX;
        endY = event.type === "mouseup" ? event.screenY : event.changedTouches[0].screenY;
        handleArrowSwipe();
    }

    const getRandomInt = (max) => {
        return Math.floor(Math.random() * max);
    };

    const nextArrow = () => {
        direction = directions[getRandomInt(4)];
        isReverseDirection = getRandomInt(2);

        const newElement = document.createElement("i");
        newElement.classList.add("fas", `fa-arrow-circle-${direction}`, "arrow", "animated", "bounceIn");
        newElement.setAttribute("style", `color: ${isReverseDirection ? "#e63946" : "#3a86ff" };`);

        gameContainer.appendChild(newElement);
    };

    const handleArrowSwipe = () => {
        const result = getValidationResult();
        const arrowElement = document.querySelector(".arrow");

        if (result === "correct") {
            score += 10;
            correct++;
            scoreElement.textContent = score;

            scoreElement.classList.remove("pulse", "reversePulse");
            setTimeout(() => {
                scoreElement.classList.add("pulse");
            }, 0);

            arrowElement.remove();
            nextArrow();
        } else if (result === "wrong") {
            if (score > 0) {
                score = Math.max(0, score - 10); // score-=10;
                failed++;
                scoreElement.textContent = score;

                scoreElement.classList.remove("pulse", "reversePulse");
                setTimeout(() => {
                    scoreElement.classList.add("reversePulse");
                }, 0);
            }
            arrowElement.classList.remove("bounceIn", "shake");
            setTimeout(() => {
                arrowElement.classList.add("shake");
            }, 0);
        }

        startX = 0;
        startY = 0;
        endX = 0;
        endY = 0;
    }

    const getValidationResult = () => {
        let result = "";
        // const sensitivityThreshold = 10;
        if (correctDirection() === "up") {
            // if(Math.abs(endY-startY)>sensitivityThreshold) {
            if (endY < startY) result = "correct"; // Swiped up
            else if (endY > startY) result = "wrong"; // Swiped down
            // }
        } else if (correctDirection() === "right") {
            if (endX > startX) result = "correct"; // Swiped right
            else if (endX < startX) result = "wrong"; // Swiped left
        } else if (correctDirection() === "down") {
            if (endY > startY) result = "correct"; // Swiped down
            else if (endY < startY) result = "wrong"; // Swiped up
        } else if (correctDirection() === "left") {
            if (endX < startX) result = "correct"; // Swiped left
            else if (endX > startX) result = "wrong"; // Swiped right
        }
        return result;
    }

    const correctDirection = () => {
        if (!isReverseDirection) return direction;
        if (direction === "up") return "down";
        if (direction === "right") return "left";
        if (direction === "down") return "up";
        if (direction === "left") return "right";
    }

    const restartGame = () => {
        const arrowElement = document.querySelector("body i.arrow");

        clearInterval(progressBarInterval);
        progressBarWidthNumerator = gameDuration * 1000;
        score = 0;
        correct = 0;
        failed = 0;

        startX = 0;
        startY = 0;
        endX = 0;
        endY = 0;

        scoreElement.textContent = score;
        if (arrowElement !== null) {
            arrowElement.remove();
        }

        console.log('restartGame');

        return true;
    }

    const progressBarFrame = () => {
        if (progressBarWidthNumerator <= 0) {
            clearInterval(progressBarInterval);
            gameContainer.removeEventListener("mousedown", lock);
            gameContainer.removeEventListener("touchstart", lock);
            gameContainer.removeEventListener("mouseup", release);
            gameContainer.removeEventListener("touchend", release);
            progressBarElement.setAttribute("style", "width: 0%; background-color: #00cc99;");

            setStage('result');
            stageResult();

            console.log('progressBarFrame');

            return true;
        } else {
            progressBarWidthNumerator -= 10;
            const currentProgressBarWidth = progressBarWidthNumerator / progressBarWidthDenominator;

            if (currentProgressBarWidth <= 0.10) {
                progressBarElement.setAttribute("style", `width: ${100*currentProgressBarWidth}%; background-color: #ff3300;`);
            } else if (currentProgressBarWidth <= 0.25) {
                progressBarElement.setAttribute("style", `width: ${100*currentProgressBarWidth}%; background-color: #ff9f40;`);
            } else {
                progressBarElement.setAttribute("style", `width: ${100*currentProgressBarWidth}%;`);
            }
        }


    };

    const initGame = () => {

        gameContainer.addEventListener("mousedown", lock);
        gameContainer.addEventListener("touchstart", lock);

        gameContainer.addEventListener("mouseup", release);
        gameContainer.addEventListener("touchend", release);

        nextArrow();

        progressBarInterval = setInterval(progressBarFrame, 10);

        console.log('initGame');

        return true;
    };

    const resetGame = (e) => {
      e.preventDefault();

      setStage('start');
      restartGame();

      return true;
  };

    const stageResult = () => {
        let totalSwipe = correct + failed;
        let percentage = totalSwipe < 1 ? 0 : (correct / totalSwipe) * 100;

        let percentageFinal = Math.round(percentage).toString();

        let attrPercentage = document.querySelector('.b-result .circle-chart__circle');
        let textPercentage = document.querySelector('.b-result .circle-chart__percent');
        let textScore = document.querySelector('.b-result #total-score');
        let textCorrect = document.querySelector('.b-result #total-correct');
        let textFail = document.querySelector('.b-result #total-fail');


        attrPercentage.setAttribute('stroke-dasharray', percentageFinal + ',100');
        textPercentage.innerHTML = percentageFinal + '%';
        textScore.innerHTML = score;
        textCorrect.innerHTML = correct;
        textFail.innerHTML = failed;

        btnRefresh.addEventListener('click', resetGame);

        console.log('handleStageResult', percentageFinal);

        return;
    };

    const handleStageStart = () => {
        let btnStart = document.querySelector('.btn-start');
        let btnIntro = document.querySelector('.cta-intro');
        let btnClose = document.querySelector('.btn-close');

        btnStart.addEventListener('click', function(e) {
            e.preventDefault();

            setStage('games');
            initGame();
        });

        btnIntro.addEventListener('click', function(e) {
            e.preventDefault();

            let idTarget = e.target.getAttribute('data-target');
            let elmTarget = document.querySelector(idTarget);

            elmTarget.classList.add("active");
        });

        btnClose.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            let idTarget = e.target.getAttribute('data-target');
            let elmTarget = document.querySelector(idTarget);

            elmTarget.classList.remove("active");
        });

        btnRefresh.removeEventListener('click', resetGame);

        console.log('handleStageStart');

        return true;
    };

    const setStage = (stage = null) => {
        activeStage = stage;
        let contentStage = document.querySelectorAll('.wrapper > .content');
        let stageActive = document.querySelector('.content[data-stage="' + activeStage + '"]');

        contentStage.forEach(function(node) {
            node.classList.remove('active');
        });

        stageActive.classList.add('active');

        return true;
    };

    const init = () => {
        handleStageStart();
    };

    return init();
}

// -- start games!
window.onload = () => {
    stage();
}
