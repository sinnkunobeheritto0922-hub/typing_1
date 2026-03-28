// -----------------------------
// 単語データ
// -----------------------------
let words = [
  { word: "くるま", type: "car" },
  { word: "ひこうき", type: "plane" },
  { word: "ばす", type: "bus" }
];

let current;
let userInput = "";
let score = 0;

// 演出用
let flash = 0;
let happy = false;
let happyTimer = 0;

// -----------------------------
// セットアップ
// -----------------------------
function setup() {
  let canvas = createCanvas(400, 400);
  canvas.parent("game");

  let input = document.getElementById("typingInput");

  // Enterキーで判定する
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      if (input.value === current.word) {
        score++;
        showCorrectEffect();
        input.value = "";
        userInput = "";
        nextQuestion();
      } else {
        // 不正解のときの演出（必要なら追加できる）
        input.value = "";
        userInput = "";
      }
    }
  });

  // 入力途中の文字を表示するだけ（判定はしない）
  input.addEventListener("input", () => {
    userInput = input.value;
  });

  textAlign(CENTER, CENTER);
  textSize(24);
  nextQuestion();
}

// -----------------------------
// メイン描画
// -----------------------------
function draw() {
  // 正解時の光る演出
  if (flash > 0) {
    background(255, 255, 150);
    flash--;
  } else {
    background(255);
  }

  // キャラ描画
  drawCharacter(current.type);

  // 単語
  fill(0);
  textSize(32);
  text(current.word, width / 2, 260);

  // 入力中の文字
  textSize(24);
  text("入力: " + userInput, width / 2, 310);

  // スコア
  textSize(18);
  text("スコア: " + score, width / 2, 360);

  // ニコニコ時間の管理
  if (happy) {
    happyTimer--;
    if (happyTimer <= 0) happy = false;
  }
}

// -----------------------------
// 正解演出
// -----------------------------
function showCorrectEffect() {
  flash = 10;       // 背景が光る
  happy = true;     // キャラが笑顔
  happyTimer = 20;  // 20フレーム笑顔
}

// -----------------------------
// 次の問題へ
// -----------------------------
function nextQuestion() {
  current = random(words);
  userInput = "";
}

// -----------------------------
// キャラ描画
// -----------------------------
function drawCharacter(type) {
  if (type === "car") drawCar(happy);
  if (type === "plane") drawPlane(happy);
  if (type === "bus") drawBus(happy);
}

// -----------------------------
// 車
// -----------------------------
function drawCar(isHappy) {
  fill(80, 150, 255);
  rect(120, 80, 160, 80, 20);

  fill(255, 80, 80);
  rect(150, 40, 100, 50, 20);

  // 顔
  fill(255);
  ellipse(200, 120, 60, 40);

  fill(0);
  if (isHappy) {
    // ニコニコ目
    arc(185, 115, 12, 12, 0, PI);
    arc(215, 115, 12, 12, 0, PI);
  } else {
    ellipse(185, 115, 8, 8);
    ellipse(215, 115, 8, 8);
  }

  // 口
  arc(200, 130, 30, 20, 0, PI);

  // タイヤ
  fill(0);
  ellipse(150, 170, 40, 40);
  ellipse(250, 170, 40, 40);
}

// -----------------------------
// 飛行機
// -----------------------------
function drawPlane(isHappy) {
  fill(200, 230, 255);
  ellipse(200, 120, 180, 60);

  fill(150, 200, 255);
  ellipse(150, 120, 80, 20);
  ellipse(250, 120, 80, 20);

  // 顔
  fill(255);
  ellipse(230, 120, 50, 35);

  fill(0);
  if (isHappy) {
    arc(220, 115, 12, 12, 0, PI);
    arc(240, 115, 12, 12, 0, PI);
  } else {
    ellipse(220, 115, 8, 8);
    ellipse(240, 115, 8, 8);
  }

  arc(230, 130, 25, 15, 0, PI);
}

// -----------------------------
// バス
// -----------------------------
function drawBus(isHappy) {
  fill(180, 255, 180);
  rect(100, 60, 200, 100, 20);

  fill(255);
  rect(120, 80, 50, 40, 10);
  rect(180, 80, 50, 40, 10);
  rect(240, 80, 40, 40, 10);

  // 顔
  fill(255);
  ellipse(200, 140, 80, 40);

  fill(0);
  if (isHappy) {
    arc(185, 135, 12, 12, 0, PI);
    arc(215, 135, 12, 12, 0, PI);
  } else {
    ellipse(185, 135, 8, 8);
    ellipse(215, 135, 8, 8);
  }

  arc(200, 150, 30, 20, 0, PI);

  // タイヤ
  fill(0);
  ellipse(150, 170, 40, 40);
  ellipse(250, 170, 40, 40);
}
