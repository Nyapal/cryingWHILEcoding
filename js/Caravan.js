// eslint-disable-next-line no-var
var BartC = BartC || {}

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

class Caravan {
  constructor() {
    this.stats = {
      day: 0,
      distance: 0,
      crew: 30,
      food: 80,
      oxen: 3,
      money: 200,
      firepower: 6
    }

    this.init(this.stats)
  }

  init({ day, distance, crew, food, oxen, money, firepower }) {
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
    this.capacity = this.oxen * BartC.WEIGHT_PER_OX + this.crew * BartC.WEIGHT_PER_PERSON;

    // how much weight do we currently have
    this.weight = this.food * BartC.FOOD_WEIGHT + this.firepower * BartC.FIREPOWER_WEIGHT;

    // drop things behind if it's too much weight
    // assume guns get dropped before food
    while (this.firepower && this.capacity <= this.weight) {
      this.firepower -= 1;
      this.weight -= BartC.FIREPOWER_WEIGHT;
      droppedGuns += 1;
    }

    if (droppedGuns) {
      this.ui.notify(`Left ${droppedGuns} guns behind`, 'negative');
    }

    while (this.food && this.capacity <= this.weight) {
      this.food -= 1;
      this.weight -= BartC.FOOD_WEIGHT;
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
    const speed = BartC.SLOW_SPEED + diff / this.capacity * BartC.FULL_SPEED;
    this.distance += speed;
  }

  //food consumption
  consumeFood() {
    this.food -= this.crew * BartC.FOOD_PER_PERSON;
    if (this.food < 0) {
      this.food = 0;
    }
  }

}

BartC.Caravan = new Caravan();