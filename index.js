/**
 * Name: Haiyang Hong
 * Date: 4/18
 * CSE 154 Section AE
 * TA: Alex Larsen
 *
 * This is the JS file for my little game "galaxy rescue". When game starts, images of jets and
 * helicopters are being appended to random slots in game area constantly until all the alots are
 * filled. If in the end all slots are filled with only helicopters then the player wins. Player
 * clicks on jet images to remove them from the DOM. If players clicks on a helicopter,they lose
 * instantly.
 */
"use strict";
(function() {

  // SIZE is used to determine how many slots the play area should be devided into.
  let SIZE = 0;

  /**
   * DIFFICULTY is used to determine the speed of the game. Its value will be set according to
   * radio button input.
   */
  let DIFFICULTY = 0;

  // This object acts as a maps to connect correct SIZE according to DIFFICULTY input
  const DEFFICULTY_TO_SIZE = {
    1000: 3,
    800: 4,
    600: 5
  };

  /**
   * This helper function randomly picks and return a number from given options.
   * every function detailing what it's purpose is
   * @param {integer} optionCount - the number of total potential options to randomly choose from.
   * @returns {integer} an integer that is in the range of 1 to optionCount.
   */
  function getRandomNum(optionCount) {
    return Math.floor(Math.random() * optionCount) + 1;
  }

  /**
   * Add a function that will be called when the window is loaded.
   */
  window.addEventListener("load", init);

  /**
   * This function attaches a click eventlistner to the 'fight' button, when the button is clicked,
   * startGame function will be invoked.
   */
  function init() {
    qs("button").addEventListener("click", startGame);
  }

  /**
   * This function represents start of the game, it invokes setGameDifficulty function to set game
   * difficulty according to player selection. It invokes displayPlayGround function to split the
   * game area into multiple slots. It invokes addJetsAndHelis function to add jet and helicopter
   * images into the slots.
   */
  function startGame() {
    setGameDifficulty();
    displayPlayGround();
    addJetsAndHelis();
  }

  /**
   * This function reads the value of player selected radio button and sets the DIFFIULTY module
   * global to that value. It also sets the SIZE module global's value according to DIFFICULTY.
   */
  function setGameDifficulty() {
    DIFFICULTY = qs('input[type="radio"]:checked').value;
    SIZE = DEFFICULTY_TO_SIZE[DIFFICULTY];
  }

  /**
   * This function replaces game intro section and menu panel with a game area. It splits the game
   * area into SIZE by SIZE slots in order to add images into them later on.
   */
  function displayPlayGround() {
    playBackgroundSound();
    const playGround = gen("div");
    playGround.setAttribute("id", "play-ground");
    for (let i = 0; i < SIZE; i++) {
      const col = gen("div");
      col.classList.add(`col${i + 1}`);
      for (let j = 0; j < SIZE; j++) {
        const row = gen("div");
        row.classList.add(`row${j + 1}`);
        col.appendChild(row);
      }
      playGround.appendChild(col);
    }
    document.body.replaceChild(playGround, qs("#menu-panel"));
    qs("body #intro").classList.add("hidden");
  }

  /**
   * This function plays background music during the game. It is invoked from the displayPlayGround
   * function.
   */
  function playBackgroundSound() {
    const backgroundAudio = new Audio("./audios/8bit-background.mp3");
    backgroundAudio.volume = 0.3;
    backgroundAudio.loop = true;
    backgroundAudio.play();
  }

  /**
   * This function randomly adds jets and helicopters images into game area slots. It will keep
   * adding until all the slots are full.
   */
  function addJetsAndHelis() {
    const addJetInterval = setInterval(() => {

      // The last two slots will be filled with helicopter, to optimize player experience.
      if (qsa('[alt="fighterjet"]').length + qsa('[alt="helicopter"]').length >= SIZE * SIZE - 2) {
        addHelicopter();
        checkIfGameFinished(addJetInterval);
      } else {

        // Randomly fills alots with jet or helicoipter images.
        const randomAddOptions = 5;
        const randomAddType = getRandomNum(randomAddOptions);
        if (randomAddType === 1 || randomAddType === 2 || randomAddType === 3) {
          addJet();
        } else {
          addHelicopter(addJetInterval);
        }
      }

    // DIFFICULTY module global is used as time argument for setINterval.
    }, DIFFICULTY);
  }

  /**
   * This function randomly selects from 6 jet images and creats an HTML element for it.
   * It adds a click event listener to the element to it. When clicked, removeJet function
   * will be invoked.
   */
  function addJet() {
    const fighterJetAudio = new Audio("./audios/fighterjet-spawned.mp3");
    fighterJetAudio.volume = 0.3;
    fighterJetAudio.play();
    const jetImg = gen("img");
    const randomJetTypes = 6;
    const randomJet = getRandomNum(randomJetTypes);
    jetImg.src = `./images/fighter-jet-${randomJet}.png`;
    jetImg.alt = "fighterjet";
    jetImg.addEventListener("click", (event) => removeJet(event));
    displayJetnHeliOnScreen(jetImg);
  }

  /**
   * This function randomly selects from 2 helicopter images and creats an HTML element for it.
   * It adds a click event listener to the element to it. When clicked, friendlyFire function
   * will be invoked.
   * @param {integer} addJetInterval - an ID that uniquely identifies the interval for
   * later clearing use.
   */
  function addHelicopter(addJetInterval) {
    const helicopterAudio = new Audio("./audios/helicopter-spawned.mp3");
    helicopterAudio.play();
    const heliImg = gen("img");
    const randomHeli = getRandomNum(2);
    heliImg.src = `./images/helicopter-${randomHeli}.png`;
    heliImg.alt = "helicopter";
    heliImg.addEventListener("click", (event) => friendlyFire(event, addJetInterval));
    displayJetnHeliOnScreen(heliImg);
  }

  /**
   * This function is invoked from addJet and addHelicopter function, it appends the new jet or
   * helicopter image element to avaliable slots in the game area.
   * @param {object} itemToDisplay - either a jet image or a helicopter image element.
   */
  function displayJetnHeliOnScreen(itemToDisplay) {
    let randomRowNum = getRandomNum(SIZE);
    let randomColNum = getRandomNum(SIZE);

    // Only display jets / helicopters in empty slot
    while (qs(`.col${randomRowNum} > .row${randomColNum}`).innerHTML !== "") {
      randomRowNum = getRandomNum(SIZE);
      randomColNum = getRandomNum(SIZE);
    }
    qs(`.col${randomRowNum} > .row${randomColNum}`).appendChild(itemToDisplay);
  }

  /**
   * This callback function is invoked when a jet image is clicked, it will remove that image
   * element from the DOM.
   * @param {object} event - the event that triggered this callback.
   */
  function removeJet(event) {
    const shootingAudio = new Audio("./audios/shooting.mp3");
    shootingAudio.volume = 0.5;
    shootingAudio.play();
    setExplosionImg(event);
    const targetJet = event.currentTarget;
    const removeTimeout = 150;
    setTimeout(
      () => {
        targetJet.remove();
      },
      removeTimeout,
      targetJet
    );
  }

  /**
   * This callback function is invoked when a helicopter image is clicked, it will invoke
   * checkIfGameFinished funcion to end the game.
   * @param {object} event - the event that triggered this callback.
   * @param {integer} addJetInterval - an ID that uniquely identifies the interval for
   * later clearing use.
   */
  function friendlyFire(event, addJetInterval) {
    const memeAudio = new Audio("./audios/cant-believe-you-done-this.mp3");
    memeAudio.play();
    setExplosionImg(event);
    const isFriendlyFired = true;
    checkIfGameFinished(addJetInterval, isFriendlyFired);
  }

  /**
   * This function is invoked from removeJet and friendlyFire function, it replaces the jet or
   * helicopter image with a explosion image.
   * element from the DOM.
   * @param {object} event - the event that triggered removeJet or friendlyFire callback.
   */
  function setExplosionImg(event) {
    event.currentTarget.src = "./images/explosion.png";
    event.currentTarget.alt = "explosion";
  }

  /**
   * This function checks if the game should be finished so that no more images should be added.
   * @param {integer} addJetInterval - an ID that uniquely identifies the interval for
   * later clearing use.
   * @param {boolean} isFriendlyFired - indicates whether player friendly fired a helicopter
   */
  function checkIfGameFinished(addJetInterval, isFriendlyFired) {
    if (

      // If all slots are full or if user friendly firedm then the game should end
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
  }

  /**
   * This function replaces the game area with a heading displaying whether the player won or lost,
   * it conditionaly displays a image for better player experience.It also adds a button
   * element to the DOM with a click event listener, when clicked, resetGame will be invoked.
   * @param {boolean} won - true if the player won, false if not.
   */
  function displayResult(won) {
    const displayResultTimeout = 500;
    setTimeout(() => {
      const resetButton = gen("button");
      resetButton.textContent = "REPlAY";
      resetButton.addEventListener("click", resetGame);
      const resultHeading = gen("h1");
      if (won) {
        resultHeading.textContent = "MISSION SUCCESS!";
        const winningAudio = new Audio("./audios/mission-success.mp3");
        winningAudio.play();
      } else {
        resultHeading.textContent = "MISSION FAILED!";
        const failedAudio = new Audio("./audios/mission-failed.mp3");
        failedAudio.volume = 0.5;
        const playAudioTimeout = 750;
        setTimeout(
          () => {
            failedAudio.play();
          },
          playAudioTimeout,
          failedAudio
        );
      }
      document.body.replaceChild(resultHeading, qs("#play-ground"));
      document.body.insertBefore(getResultImg(won), qs("h1:last-of-type"));
      qs("h1:last-of-type").insertAdjacentElement("afterend", resetButton);
    }, displayResultTimeout);
  }

  /**
   * This function is invoked from displayResult, it conditionaly returns different image elements.
   * @param {boolean} won - true if the player won, false if not.
   * @returns {object} An image that indicates whether the player won or not
   */
  function getResultImg(won) {
    const resultImg = gen("img");
    resultImg.src = won ? "./images/honor.png" : "./images/grave.png";
    resultImg.alt = "result";
    resultImg.classList.add("result-img");
    return resultImg;
  }

  /**
   * This function resets the game, gets ready for next round of play.
   */
  function resetGame() {
    window.location.href = "./index.html";
  }

  /** ------------------------------ Helper Functions  ------------------------------ */

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