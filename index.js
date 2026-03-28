// p5.js インスタンスモード
new p5((p) => {

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
  let timeLimit = 30;
  let startTime;
  let isPlaying = true;

  // スタート画面
  let gameStarted = false;

  // 最高スコア
  let bestScore = 0;

  // -----------------------------
  // セットアップ
  // -----------------------------
  p.setup = function () {
    let canvas = p.createCanvas(400, 420);
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

        if (!gameStarted) return;

        if (!isPlaying) {
          restartGame();
          return;
        }

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

    input.addEventListener("input", () => {
      userInput = input.value;
    });

    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(24);

    nextQuestion();
  };

  // -----------------------------
  // メイン描画
  // -----------------------------
  p.draw = function () {

    if (!gameStarted) {
      drawStartScreen();
      return;
    }

    if (flash > 0) {
      p.background(255, 255, 150);
      flash--;
    } else if (missFlash > 0) {
      p.background(255, 150, 150);
      missFlash--;
    } else {
      p.background(255);
    }

    drawCharacter(current.type, happy, sad);

    p.fill(0);
    p.textSize(32);
    p.text(current.word, p.width / 2, 260);

    p.textSize(24);
    p.text("入力: " + userInput, p.width / 2, 310);

    p.textSize(18);
    p.text("スコア: " + score, p.width / 2, 350);

    p.text("さいこうスコア: " + bestScore, p.width / 2, 390);

    if (isPlaying) {
      let elapsed = Math.floor((p.millis() - startTime) / 1000);
      let remaining = timeLimit - elapsed;

      if (remaining <= 0) {
        isPlaying = false;
        remaining = 0;

        if (score > bestScore) {
          bestScore = score;
          localStorage.setItem("bestScore", bestScore);
        }
      }

      p.textSize(20);
      p.text("のこり時間: " + remaining + "秒", p.width / 2, 30);
    }

    if (!isPlaying) {
      p.textSize(32);
      p.fill(0);
      p.text("じかんぎれ！", p.width / 2, 150);
      p.text("スコア: " + score, p.width / 2, 200);
      p.text("さいこうスコア: " + bestScore, p.width / 2, 250);

      p.textSize(20);
      p.text("Enterキーで もういちど", p.width / 2, 300);
    }
  };

  // -----------------------------
  // スタート画面
  // -----------------------------
  function drawStartScreen() {
    p.background(255);

    p.textSize(36);
    p.fill(0);
    p.text("タイピングゲーム", p.width / 2, 150);

    p.textSize(20);
    p.text("スタートをおしてね", p.width / 2, 200);

    p.fill(100, 200, 255);
    p.rect(p.width / 2 - 80, 250, 160, 50, 10);

    p.fill(0);
    p.textSize(24);
    p.text("スタート", p.width / 2, 275);
  }

  // -----------------------------
  // マウスクリックでスタート
  // -----------------------------
  p.mousePressed = function () {
    if (!gameStarted) {
      if (p.mouseX > p.width / 2 - 80 && p.mouseX < p.width / 2 + 80 &&
          p.mouseY > 250 && p.mouseY < 300) {

        gameStarted = true;
        isPlaying = true;
        startTime = p.millis();
        score = 0;

        document.getElementById("typingInput").focus();
      }
    }
  };

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
    current = p.random(words);
    userInput = "";
  }

  // -----------------------------
  // 再スタート
  // -----------------------------
  function restartGame() {
    score = 0;
    isPlaying = true;
    startTime = p.millis();
    nextQuestion();
    document.getElementById("typingInput").focus();
  }

  // -----------------------------
  // キャラ描画
  // -----------------------------
  function drawCharacter(type, isHappy, isSad) {
    if (type === "car") drawCar(isHappy, isSad);
    if (type === "plane") drawPlane(isHappy, isSad);
    if (type === "bus") drawBus(isHappy, isSad);

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
    p.fill(80, 150, 255);
    p.rect(120, 80, 160, 80, 20);

    p.fill(255, 80, 80);
    p.rect(150, 40, 100, 50, 20);

    p.fill(255);
    p.ellipse(200, 120, 60, 40);

    p.fill(0);
    if (isHappy) {
      p.arc(185, 115, 12, 12, 0, p.PI);
      p.arc(215, 115, 12, 12, 0, p.PI);
    } else if (isSad) {
      p.line(180, 115, 190, 110);
      p.line(210, 110, 220, 115);
    } else {
      p.ellipse(185, 115, 8, 8);
      p.ellipse(215, 115, 8, 8);
    }

    p.arc(200, 130, 30, 20, 0, p.PI);

    p.fill(0);
    p.ellipse(150, 170, 40, 40);
    p.ellipse(250, 170, 40, 40);
  }

  // -----------------------------
  // 飛行機
  // -----------------------------
  function drawPlane(isHappy, isSad) {
    p.fill(200, 230, 255);
    p.ellipse(200, 120, 180, 60);

    p.fill(150, 200, 255);
    p.ellipse(150, 120, 80, 20);
    p.ellipse(250, 120, 80, 20);

    p.fill(255);
    p.ellipse(230, 120, 50, 35);

    p.fill(0);
    if (isHappy) {
      p.arc(220, 115, 12, 12, 0, p.PI);
      p.arc(240, 115, 12, 12, 0, p.PI);
    } else if (isSad) {
      p.line(215, 115, 225, 110);
      p.line(235, 110, 245, 115);
    } else {
      p.ellipse(220, 115, 8, 8);
      p.ellipse(240, 115, 8, 8);
    }

    p.arc(230, 130, 25, 15, 0, p.PI);
  }

  // -----------------------------
  // バス
  // -----------------------------
  function drawBus(isHappy, isSad) {
    p.fill(180, 255, 180);
    p.rect(100, 60, 200, 100, 20);

    p.fill(255);
    p.rect(120, 80, 50, 40, 10);
    p.rect(180, 80, 50, 40, 10);
    p.rect(240, 80, 40, 40, 10);

    p.fill(255);
    p.ellipse(200, 140, 80, 40);

    p.fill(0);
    if (isHappy) {
      p.arc(185, 135, 12, 12, 0, p.PI);
      p.arc(215, 135, 12, 12, 0, p.PI);
    } else if (isSad) {
      p.line(180, 135, 190, 130);
      p.line(210, 130, 220, 135);
    } else {
      p.ellipse(185, 135, 8, 8);
      p.ellipse(215, 135, 8, 8);
    }

    p.arc(200, 150, 30, 20, 0, p.PI);

    p.fill(0);
    p.ellipse(150, 170, 40, 40);
    p.ellipse(250, 170, 40, 40);
  }

});
