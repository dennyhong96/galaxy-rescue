/**
 * Name: _your name here_
 * Date: _add date here_
 * Section: CSE 1SIZE4 _your section here_
 *
 * -- your description of what this file does here --
 * Do not keep comments from this template in any work you submit (functions included under "Helper
 * functions" are an exception, you may keep the function names/comments of id/qs/qsa/gen)
 */
"use strict";

(function () {
  // MODULE GLOBAL VARIABLES, CONSTANTS, AND HELPER FUNCTIONS CAN BE PLACED HERE
  let SIZE = 0;
  let DIFFICULTY = 0;
  const DEFFICULTY_TO_SIZE = {
    1000: 3,
    800: 4,
    600: 5,
  };

  const getRandomNum = (optionCount) => {
    return Math.floor(Math.random() * optionCount) + 1;
  };

  /**
   * Add a function that will be called when the window is loaded.
   */
  window.addEventListener("load", init);

  /**
   * CHANGE: Describe what your init function does here.
   */
  function init() {
    // THIS IS THE CODE THAT WILL BE EXECUTED ONCE THE WEBPAGE LOADS
    qs("button").addEventListener("click", startGame);
  }
  /**
   * Make sure to always add a descriptive comment above
   * every function detailing what it's purpose is
   * Use JSDoc format with @param and @return.
   */
  const startGame = () => {
    setGameDifficulty();
    displayPlayGround();
    addJetsAndHelis();
  };

  const setGameDifficulty = () => {
    DIFFICULTY = qs('input[type="radio"]:checked').value;
    SIZE = DEFFICULTY_TO_SIZE[DIFFICULTY];
    console.log(DIFFICULTY);
  };

  const displayPlayGround = () => {
    playBackgroundSound();
    let playGround = gen("div");
    playGround.setAttribute("id", "play-ground");
    for (let i = 0; i < SIZE; i++) {
      let col = gen("div");
      col.classList.add(`col${i + 1}`);
      for (let j = 0; j < SIZE; j++) {
        let row = gen("div");
        row.classList.add(`row${j + 1}`);
        col.appendChild(row);
      }
      playGround.appendChild(col);
    }
    document.body.replaceChild(playGround, qs("#menu-panel"));
    qs("body #intro").classList.add("hidden");
  };

  const playBackgroundSound = () => {
    const backgroundAudio = new Audio("./audios/8bit-background.mp3");
    backgroundAudio.volume = 0.3;
    backgroundAudio.loop = true;
    backgroundAudio.play();
  };

  const addJetsAndHelis = () => {
    console.log("fighter", qsa('[alt="fighterjet"]').length);
    console.log("heli", qsa('[alt="helicopter"]').length);
    let addJetInterval = setInterval(() => {
      // The last two items to add are always friendly helicopter, to optimize player experience
      if (qsa('[alt="fighterjet"]').length + qsa('[alt="helicopter"]').length >= SIZE * SIZE - 2) {
        addHelicopter();
        checkIfGameFinished(addJetInterval);
        console.log("force added heli");
      } else {
        let randomAddType = getRandomNum(5);
        if (randomAddType === 1 || randomAddType === 2 || randomAddType === 3) {
          addJet();
        } else {
          addHelicopter(addJetInterval);
        }
      }
    }, DIFFICULTY);
  };

  const addJet = () => {
    const fighterJetAudio = new Audio("./audios/fighterjet-spawned.mp3");
    fighterJetAudio.volume = 0.3;
    fighterJetAudio.play();
    console.log("added jet");
    const jetImg = gen("img");
    const randomJet = getRandomNum(6);
    jetImg.src = `./images/fighter-jet-${randomJet}.png`;
    jetImg.alt = "fighterjet";
    jetImg.addEventListener("click", (event) => removeJet(event));
    displayJetnHeliOnScreen(jetImg);
  };

  const addHelicopter = (addJetInterval) => {
    const helicopterAudio = new Audio("./audios/helicopter-spawned.mp3");
    helicopterAudio.play();
    console.log("added heli");
    const heliImg = gen("img");
    const randomHeli = getRandomNum(2);
    heliImg.src = `./images/helicopter-${randomHeli}.png`;
    heliImg.alt = "helicopter";
    heliImg.addEventListener("click", (event) => friendlyFire(event, addJetInterval));
    displayJetnHeliOnScreen(heliImg);
  };

  const removeJet = (event) => {
    const shootingAudio = new Audio("./audios/shooting.mp3");
    shootingAudio.volume = 0.5;
    shootingAudio.play();
    setExplosionImg(event);
    const targetJet = event.currentTarget;
    setTimeout(
      () => {
        targetJet.remove();
      },
      150,
      targetJet
    );
  };

  const friendlyFire = (event, addJetInterval) => {
    const memeAudio = new Audio("./audios/cant-believe-you-done-this.mp3");
    memeAudio.play();
    setExplosionImg(event);
    const isFriendlyFired = true;
    checkIfGameFinished(addJetInterval, isFriendlyFired);
  };

  const setExplosionImg = (event) => {
    event.currentTarget.src = "./images/explosion.png";
    event.currentTarget.alt = "explosion";
  };

  const displayJetnHeliOnScreen = (itemToDisplay) => {
    let randomRowNum = getRandomNum(SIZE);
    let randomColNum = getRandomNum(SIZE);
    console.log(randomRowNum, randomColNum);
    // Only display jets or helicopters in empty location
    while (qs(`.col${randomRowNum} > .row${randomColNum}`).innerHTML !== "") {
      randomRowNum = getRandomNum(SIZE);
      randomColNum = getRandomNum(SIZE);
    }
    qs(`.col${randomRowNum} > .row${randomColNum}`).appendChild(itemToDisplay);
  };

  const checkIfGameFinished = (addJetInterval, isFriendlyFired) => {
    if (
      // If there are 16 jets + helicopters in total on screen or if user friendly fired
      // Then the game should end
      qsa('[alt="fighterjet"]').length + qsa('[alt="helicopter"]').length >= SIZE * SIZE ||
      isFriendlyFired
    ) {
      clearInterval(addJetInterval);
      let won = false;
      if (
        qsa('[alt="fighterjet"]').length === 0 &&
        qsa('[alt="helicopter"]').length === SIZE * SIZE
      ) {
        won = true;
      }
      displayResult(won);
    }
  };

  const displayResult = (won) => {
    setTimeout(() => {
      const replayButton = gen("button");
      replayButton.textContent = "REPlAY";
      replayButton.addEventListener("click", replay);
      const resultHeading = gen("h1");
      if (won) {
        resultHeading.textContent = "MISSION SUCCESS!";
        const winningAudio = new Audio("./audios/mission-success.mp3");
        winningAudio.play();
        console.log("win");
      } else {
        resultHeading.textContent = "MISSION FAILED!";
        const failedAudio = new Audio("./audios/mission-failed.mp3");
        failedAudio.volume = 0.5;
        setTimeout(
          () => {
            failedAudio.play();
          },
          900,
          failedAudio
        );

        console.log("lose");
      }
      document.body.replaceChild(resultHeading, qs("#play-ground"));
      document.body.insertBefore(getResultImg(won), qs("h1:last-of-type"));
      qs("h1:last-of-type").insertAdjacentElement("afterend", replayButton);
    }, 500);
  };

  const getResultImg = (won) => {
    const resultImg = gen("img");
    resultImg.src = won ? "./images/honor.png" : "./images/grave.png";
    resultImg.alt = "result";
    resultImg.classList.add("result-img");
    return resultImg;
  };

  const replay = () => {
    window.location.href = "./index.html";
  };
  /**
   * Make sure to always add a descriptive comment above
   * every function detailing what it's purpose is
   * @param {variabletype} someVariable This is a description of someVariable, including, perhaps, preconditions.
   * @returns {returntype} A description of what this function is actually returning
   */
  function exampleFunction2(someVariable) {
    /* SOME CODE */
    return something;
  }

  /** ------------------------------ Helper Functions  ------------------------------ */
  /**
   * Note: You may use these in your code, but remember that your code should not have
   * unused functions. Remove this comment in your own code.
   */

  /**
   * Returns the element that has the ID attribute with the specified value.
   * @param {string} idName - element ID
   * @returns {object} DOM object associated with id.
   */
  function id(idName) {
    return document.getElementById(idName);
  }

  /**
   * Returns the first element that matches the given CSS selector.
   * @param {string} selector - CSS query selector.
   * @returns {object} The first DOM object matching the query.
   */
  function qs(selector) {
    return document.querySelector(selector);
  }

  /**
   * Returns the array of elements that match the given CSS selector.
   * @param {string} selector - CSS query selector
   * @returns {object[]} array of DOM objects matching the query.
   */
  function qsa(selector) {
    return document.querySelectorAll(selector);
  }

  /**
   * Returns a new element with the given tag name.
   * @param {string} tagName - HTML tag name for new DOM element.
   * @returns {object} New DOM object for given HTML tag.
   */
  function gen(tagName) {
    return document.createElement(tagName);
  }
})();
