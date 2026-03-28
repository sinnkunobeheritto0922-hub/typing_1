let words = [
  { word: "くるま", type: "car" },
  { word: "ひこうき", type: "plane" },
  { word: "ばす", type: "bus" }
];

let current;
let userInput = "";
let score = 0;
let totalQuestions = 10;

function setup() {
  let canvas = createCanvas(400, 400);
  canvas.parent("game"); // ← これを追加！
  textAlign(CENTER, CENTER);
  textSize(24);
  nextQuestion();
}

function draw() {
  background(255);

  drawCharacter(current.type);

  fill(0);
  textSize(32);
  text(current.word, width / 2, 260);

  textSize(24);
  text("入力: " + userInput, width / 2, 310);

  textSize(18);
  text("スコア: " + score, width / 2, 360);
}

function keyTyped() {
  userInput += key;

  if (userInput === current.word) {
    score++;
    nextQuestion();
  }

  if (userInput.length > current.word.length) {
    userInput = "";
  }
}

function nextQuestion() {
  current = random(words);
  userInput = "";
}

function drawCharacter(type) {
  if (type === "car") drawCar();
  if (type === "plane") drawPlane();
  if (type === "bus") drawBus();
}

function drawCar() {
  fill(80, 150, 255);
  rect(120, 80, 160, 80, 20);

  fill(255, 80, 80);
  rect(150, 40, 100, 50, 20);

  fill(255);
  ellipse(200, 120, 60, 40);
  fill(0);
  ellipse(185, 115, 8, 8);
  ellipse(215, 115, 8, 8);
  arc(200, 130, 30, 20, 0, PI);

  fill(0);
  ellipse(150, 170, 40, 40);
  ellipse(250, 170, 40, 40);
}

function drawPlane() {
  fill(200, 230, 255);
  ellipse(200, 120, 180, 60);

  fill(150, 200, 255);
  ellipse(150, 120, 80, 20);
  ellipse(250, 120, 80, 20);

  fill(255, 220, 100);
  ellipse(120, 120, 30, 30);
  fill(255, 150, 150);
  rect(110, 115, 20, 10, 5);

  fill(255);
  ellipse(230, 120, 50, 35);
  fill(0);
  ellipse(220, 115, 8, 8);
  ellipse(240, 115, 8, 8);
  arc(230, 130, 25, 15, 0, PI);
}

function drawBus() {
  fill(180, 255, 180);
  rect(100, 60, 200, 100, 20);

  fill(255);
  rect(120, 80, 50, 40, 10);
  rect(180, 80, 50, 40, 10);
  rect(240, 80, 40, 40, 10);

  fill(255);
  ellipse(200, 140, 80, 40);
  fill(0);
  ellipse(185, 135, 8, 8);
  ellipse(215, 135, 8, 8);
  arc(200, 150, 30, 20, 0, PI);

  fill(0);
  ellipse(150, 170, 40, 40);
  ellipse(250, 170, 40, 40);
}
