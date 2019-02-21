// Caravan.js
// eslint-disable-next-line no-var
let OregonH = OregonH || {}

// constants
OregonH.WEIGHT_PER_OX = 20;
OregonH.WEIGHT_PER_PERSON = 2;
OregonH.FOOD_WEIGHT = 0.6;
OregonH.FIREPOWER_WEIGHT = 5;
OregonH.GAME_SPEED = 800;
OregonH.DAY_PER_STEP = 0.2;
OregonH.FOOD_PER_PERSON = 0.02;
OregonH.FULL_SPEED = 5;
OregonH.SLOW_SPEED = 3;
OregonH.FINAL_DISTANCE = 1000;
OregonH.EVENT_PROBABILITY = 0.15;
OregonH.ENEMY_FIREPOWER_AVG = 5;
OregonH.ENEMY_GOLD_AVG = 50;

//--------------------------------------------------
// Game

class Game {
  //complete me pls
}

OregonH.Game = {}; //new Game
// -------------------------------------------------
// Caravan 

class Caravan {
  constructor() {
    this.stats = {
      day = 0,
      distance = 0,
      crew = 30,
      food = 80,
      oxen = 3,
      money = 200,
      firepower = 6
    }

    this.init(this.stats)
  }

  init(day, distance, crew, food, oxen, money, firepower) {
    this.day = day,
    this.distance = distance,
    this.crew = crew,
    this.food = food,
    this.oxen = oxen,
    this.money = money,
    this.firepower = firepower
  }

  updateWeight() {
    let droppedFood = 0;
    let droppedGuns = 0;

    // how much can the caravan carry
    this.capacity = this.oxen * OregonH.WEIGHT_PER_OX + this.crew * OregonH.WEIGHT_PER_PERSON;

    // how much weight do we currently have
    this.weight = this.food * OregonH.FOOD_WEIGHT + this.firepower * OregonH.FIREPOWER_WEIGHT;

    // drop things behind if it's too much weight
    // assume guns get dropped before food
    while (this.firepower && this.capacity <= this.weight) {
      this.firepower -= 1;
      this.weight -= OregonH.FIREPOWER_WEIGHT;
      droppedGuns += 1;
    }

    if (droppedGuns) {
      this.ui.notify(`Left ${droppedGuns} guns behind`, 'negative');
    }

    while (this.food && this.capacity <= this.weight) {
      this.food -= 1;
      this.weight -= OregonH.FOOD_WEIGHT;
      droppedFood += 1;
    }

    if (droppedFood) {
      this.ui.notify(`Left ${droppedFood} food provisions behind`, 'negative');
    }
  }

  //update covered distance
  updateDistance() {
    // the closer to capacity, the slower
    const diff = this.capacity - this.weight;
    const speed = OregonH.SLOW_SPEED + diff / this.capacity * OregonH.FULL_SPEED;
    this.distance += speed;
  }

  //food consumption
  consumeFood() {
    this.food -= this.crew * OregonH.FOOD_PER_PERSON;
    if (this.food < 0) {
      this.food = 0;
    }
  }

}