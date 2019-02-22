// Game.js

// eslint-disable-next-line no-var
var BartC = BartC || {};

// constants
BartC.WEIGHT_PER_OX = 20;
BartC.WEIGHT_PER_PERSON = 2;
BartC.FOOD_WEIGHT = 0.6;
BartC.FIREPOWER_WEIGHT = 5;
BartC.GAME_SPEED = 800;
BartC.DAY_PER_STEP = 0.2;
BartC.FOOD_PER_PERSON = 0.02;
BartC.FULL_SPEED = 5;
BartC.SLOW_SPEED = 3;
BartC.FINAL_DISTANCE = 1000;
BartC.EVENT_PROBABILITY = 0.15;
BartC.ENEMY_FIREPOWER_AVG = 5;
BartC.ENEMY_GOLD_AVG = 50;

//---------------------------------------------------
// Game 



class Game {
  init () {
    //reference ui
    this.ui = BartC.UI;

    // reference event manager
    this.eventManager = BartC.Event;

    // setup caravan
    this.caravan = BartC.Caravan;
    this.caravan.init({
      day: 0,
      distance: 0,
      crew: 30,
      food: 80,
      oxen: 5,
      money: 300,
      firepower: 12,
    });

    //pass references
    this.caravan.ui = this.ui;
    this.caravan.eventManager = this.eventManager;
  
    this.ui.game = this;

    this.ui.caravan = this.caravan;
    this.ui.eventManager = this.eventManager;
  
    this.eventManager.game = this;
    this.eventManager.caravan = this.caravan;
    this.eventManager.ui = this.ui;
  
    // begin adventure!
    this.startJourney();
  }

  // start the journey and time starts running
  startJourney() {
    this.gameActive = true;
    this.previousTime = null;
    this.ui.notify('A great adventure begins', 'positive');
    
    this.step();
  }
  
  // game loop
  step(timestamp) {
    // starting, setup the previous time for the first time
    if (!this.previousTime) {
      this.previousTime = timestamp;
      this.updateGame();
    }
    
    // time difference
    const progress = timestamp - this.previousTime;
    
    // game update
    if (progress >= BartC.GAME_SPEED) {
      this.previousTime = timestamp;
      this.updateGame();
    }
    
    // we use "bind" so that we can refer to the context "this" inside of the step method
    if (this.gameActive) window.requestAnimationFrame(this.step.bind(this));
  }

  // update game stats
  updateGame() {
    // day update
    this.caravan.day += BartC.DAY_PER_STEP;
    
    // food consumption
    this.caravan.consumeFood();
    
    // game over no food
    if (this.caravan.food === 0) {
      this.ui.notify('Your caravan starved to death', 'negative');
      this.gameActive = false;
      return;
    }
    
    // update weight
    this.caravan.updateWeight();
    
    // update progress
    this.caravan.updateDistance();
    
    // show stats
    this.ui.refreshStats();
    
    // check if everyone died
    if (this.caravan.crew <= 0) {
      this.caravan.crew = 0;
      this.ui.notify('Everyone died', 'negative');
      this.gameActive = false;
      return;
    }
    
    // check win game
    if (this.caravan.distance >= BartC.FINAL_DISTANCE) {
      this.ui.notify('You have returned home!', 'positive');
      this.gameActive = false;
      return;
    }
    
    // random events
    if (Math.random() <= BartC.EVENT_PROBABILITY) {
      this.eventManager.generateEvent();
    }
  }

  // pause the journey
  pauseJourney() {
    this.gameActive = false;
  }

  // resume the journey
  resumeJourney() {
    this.gameActive = true;
    this.step();
  }

}

BartC.Game = new Game();
console.log(Game)
BartC.Game.init()