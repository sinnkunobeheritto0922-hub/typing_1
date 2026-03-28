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

let missFlash = 0;
let sad = false;
let sadTimer = 0;

// タイムアタック
let timeLimit = 30; // 秒
let startTime;
let isPlaying = true;

// スタート画面
let gameStarted = false;

// 最高スコア保存
let bestScore = 0;

// -----------------------------
// セットアップ
// -----------------------------
function setup() {
  let canvas = createCanvas(400, 420);
  canvas.parent("game");

  // 最高スコア読み込み
  let saved = localStorage.getItem("bestScore");
  if (saved !== null) {
    bestScore = Number(saved);
  }

  let input = document.getElementById("typingInput");

  // Enterキーで判定
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {

      // スタート前は無視
      if (!gameStarted) return;

      // 時間切れ → 再スタート
      if (!isPlaying) {
        restartGame();
        return;
      }

      // 正解判定
      if (input.value === current.word) {
        score++;
        showCorrectEffect();
        input.value = "";
        userInput = "";
        nextQuestion();
      } else {
        showMissEffect();
        input.value = "";
        userInput = "";
      }
    }
  });

  // 入力途中の文字を表示するだけ
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

  // -----------------------------
  // スタート画面
  // -----------------------------
  if (!gameStarted) {
    drawStartScreen();
    return;
  }

  // 背景演出
  if (flash > 0) {
    background(255, 255, 150); // 正解：黄色
    flash--;
  } else if (missFlash > 0) {
    background(255, 150, 150); // 不正解：赤
    missFlash--;
  } else {
    background(255);
  }

  // キャラ描画
  drawCharacter(current.type, happy, sad);

  // 単語
  fill(0);
  textSize(32);
  text(current.word, width / 2, 260);

  // 入力中の文字
  textSize(24);
  text("入力: " + userInput, width / 2, 310);

  // スコア
  textSize(18);
  text("スコア: " + score, width / 2, 350);

  // 最高スコア
  text("さいこうスコア: " + bestScore, width / 2, 390);

  // タイムアタック
  if (isPlaying) {
    let elapsed = floor((millis() - startTime) / 1000);
    let remaining = timeLimit - elapsed;

    if (remaining <= 0) {
      isPlaying = false;
      remaining = 0;

      // 最高スコア更新
      if (score > bestScore) {
        bestScore = score;
        localStorage.setItem("bestScore", bestScore);
      }
    }

    textSize(20);
    text("のこり時間: " + remaining + "秒", width / 2, 30);
  }

  // 時間切れ画面
  if (!isPlaying) {
    textSize(32);
    fill(0);
    text("じかんぎれ！", width / 2, 150);
    text("スコア: " + score, width / 2, 200);
    text("さいこうスコア: " + bestScore, width / 2, 250);

    textSize(20);
    text("Enterキーで もういちど", width / 2, 300);
  }
}

// -----------------------------
// スタート画面描画
// -----------------------------
function drawStartScreen() {
  background(255);

  textSize(36);
  fill(0);
  text("タイピングゲーム", width / 2, 150);

  textSize(20);
  text("スタートをおしてね", width / 2, 200);

  // スタートボタン
  fill(100, 200, 255);
  rect(width / 2 - 80, 250, 160, 50, 10);

  fill(0);
  textSize(24);
  text("スタート", width / 2, 275);
}

// -----------------------------
// マウスクリックでスタート
// -----------------------------
//function mousePressed() {
  //if (!gameStarted) {
    //if (mouseX > width / 2 - 80 && mouseX < width / 2 + 80 &&
      //  mouseY > 250 && mouseY < 300) {

   //   gameStarted = true;
   //   isPlaying = true;
    //  startTime = millis();
     // score = 0;

      // 入力欄にフォーカス
      //document.getElementById("typingInput").focus();
   // }
 // }
//}

// -----------------------------
// 正解演出
// -----------------------------
function showCorrectEffect() {
  flash = 10;
  happy = true;
  happyTimer = 20;
}

// -----------------------------
// 不正解演出
// -----------------------------
function showMissEffect() {
  missFlash = 10;
  sad = true;
  sadTimer = 20;
}

// -----------------------------
// 次の問題へ
// -----------------------------
function nextQuestion() {
  current = random(words);
  userInput = "";
}

// -----------------------------
// ゲーム再スタート
// -----------------------------
function restartGame() {
  score = 0;
  isPlaying = true;
  startTime = millis();
  nextQuestion();

  // 入力欄にフォーカス
  document.getElementById("typingInput").focus();
}

// -----------------------------
// キャラ描画
// -----------------------------
function drawCharacter(type, isHappy, isSad) {
  if (type === "car") drawCar(isHappy, isSad);
  if (type === "plane") drawPlane(isHappy, isSad);
  if (type === "bus") drawBus(isHappy, isSad);

  // 表情タイマー管理
  if (isHappy) {
    happyTimer--;
    if (happyTimer <= 0) happy = false;
  }
  if (isSad) {
    sadTimer--;
    if (sadTimer <= 0) sad = false;
  }
}

// -----------------------------
// 車
// -----------------------------
function drawCar(isHappy, isSad) {
  fill(80, 150, 255);
  rect(120, 80, 160, 80, 20);

  fill(255, 80, 80);
  rect(150, 40, 100, 50, 20);

  fill(255);
  ellipse(200, 120, 60, 40);

  fill(0);
  if (isHappy) {
    arc(185, 115, 12, 12, 0, PI);
    arc(215, 115, 12, 12, 0, PI);
  } else if (isSad) {
    line(180, 115, 190, 110);
    line(210, 110, 220, 115);
  } else {
    ellipse(185, 115, 8, 8);
    ellipse(215, 115, 8, 8);
  }

  arc(200, 130, 30, 20, 0, PI);

  fill(0);
  ellipse(150, 170, 40, 40);
  ellipse(250, 170, 40, 40);
}

// -----------------------------
// 飛行機
// -----------------------------
function drawPlane(isHappy, isSad) {
  fill(200, 230, 255);
  ellipse(200, 120, 180, 60);

  fill(150, 200, 255);
  ellipse(150, 120, 80, 20);
  ellipse(250, 120, 80, 20);

  fill(255);
  ellipse(230, 120, 50, 35);

  fill(0);
  if (isHappy) {
    arc(220, 115, 12, 12, 0, PI);
    arc(240, 115, 12, 12, 0, PI);
  } else if (isSad) {
    line(215, 115, 225, 110);
    line(235, 110, 245, 115);
  } else {
    ellipse
