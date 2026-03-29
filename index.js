console.log("index.js loaded");

// p5.js インスタンスモード
new p5((p) => {

  // -----------------------------
  // 難易度ごとの単語リスト（ひらがな統一）
  // -----------------------------
  let wordsEasy = [
    { word: "くるま" },
    { word: "ばす" },
    { word: "ふね" },
    { word: "でんしゃ" },
    { word: "ばいく" },
    { word: "すけぼー" },
    { word: "たくしー" },
    { word: "とらっく" }
  ];

  let wordsNormal = [
    { word: "ひこうき" },
    { word: "しんかんせん" },
    { word: "ろけっと" },
    { word: "ぱとかー" },
    { word: "くれーんしゃ" },
    { word: "だんぷかー" },
    { word: "ろーどろーらー" },
    { word: "はしごしゃ" },
    { word: "すぽーつかー" },
    { word: "まうんてんばいく" },
    { word: "ろーどばいく" },
    { word: "ふぇりー" },
    { word: "おーぷんかー" }
  ];

  let wordsHard = [
    { word: "しょうぼうしゃ" },
    { word: "きゅうきゅうしゃ" },
    { word: "こんくりーとみきさーしゃ" },
    { word: "しょべるかー" },
    { word: "こうそくどうろぱとろーるかー" },
    { word: "くうぼうへりこぷたー" },
    { word: "じゅうそうしゃ" }
  ];

  let currentWords = wordsEasy;
  let currentDifficulty = "easy";

  // -----------------------------
  // 難易度ごとの最高スコア
  // -----------------------------
  let bestScores = {
    easy: Number(localStorage.getItem("bestScore_easy")) || 0,
    normal: Number(localStorage.getItem("bestScore_normal")) || 0,
    hard: Number(localStorage.getItem("bestScore_hard")) || 0
  };

  // -----------------------------
  // キャラ画像
  // -----------------------------
  let characterImages = {
  easy: {
    neutral: p.loadImage("https://sinnkunobeheritto0922-hub.github.io/typing_1/img/easy_neutral.png"),
    happy:   p.loadImage("https://sinnkunobeheritto0922-hub.github.io/typing_1/img/easy_happy.png"),
    sad:     p.loadImage("https://sinnkunobeheritto0922-hub.github.io/typing_1/img/easy_sad.png")
  },
  normal: {
    neutral: p.loadImage("https://sinnkunobeheritto0922-hub.github.io/typing_1/img/normal_neutral.png"),
    happy:   p.loadImage("https://sinnkunobeheritto0922-hub.github.io/typing_1/img/normal_happy.png"),
    sad:     p.loadImage("https://sinnkunobeheritto0922-hub.github.io/typing_1/img/normal_sad.png")
  },
  hard: {
    neutral: p.loadImage("https://sinnkunobeheritto0922-hub.github.io/typing_1/img/hard_neutral.png"),
    happy:   p.loadImage("https://sinnkunobeheritto0922-hub.github.io/typing_1/img/hard_happy.png"),
    sad:     p.loadImage("https://sinnkunobeheritto0922-hub.github.io/typing_1/img/hard_sad.png")
  }
};

  // -----------------------------
  // ゲーム状態
  // -----------------------------
  let mode = "start";
  let current;
  let userInput = "";
  let score = 0;

  let flash = 0;
  let happy = false;
  let happyTimer = 0;

  let missFlash = 0;
  let sad = false;
  let sadTimer = 0;

  let timeLimit = 30;
  let startTime;

  // -----------------------------
  // セットアップ
  // -----------------------------
  p.setup = function () {
    let canvas = p.createCanvas(400, 420);
    canvas.parent("game");

    let input = document.getElementById("typingInput");

    input.addEventListener("keydown", (e) => {
      if (e.key !== "Enter") return;
      if (mode !== "play") return;

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
    });

    input.addEventListener("input", () => {
      userInput = input.value;
    });

    p.textAlign(p.CENTER, p.CENTER);
  };

  // -----------------------------
  // クリック判定（mouseReleased）
  // -----------------------------
  p.mouseReleased = function () {
    if (mode === "start") checkDifficultyButtons();
    if (mode === "result") checkRetryButton();
  };

  function insideButton(y) {
    return (
      p.mouseX > p.width / 2 - 80 &&
      p.mouseX < p.width / 2 + 80 &&
      p.mouseY > y &&
      p.mouseY < y + 50
    );
  }

  function checkDifficultyButtons() {
    if (insideButton(170)) {
      currentWords = wordsEasy;
      currentDifficulty = "easy";
      startGame();
    }
    if (insideButton(240)) {
      currentWords = wordsNormal;
      currentDifficulty = "normal";
      startGame();
    }
    if (insideButton(310)) {
      currentWords = wordsHard;
      currentDifficulty = "hard";
      startGame();
    }
  }

  function checkRetryButton() {
    if (insideButton(300)) {
      restartGame();
    }
  }

  // -----------------------------
  // メイン描画
  // -----------------------------
  p.draw = function () {
    if (mode === "start") drawStartScreen();
    else if (mode === "play") drawPlayScreen();
    else if (mode === "result") drawResultScreen();
  };

  // -----------------------------
  // スタート画面
  // -----------------------------
  function drawStartScreen() {
    p.background(255);

    p.textSize(32);
    p.fill(0);
    p.text("タイピングゲーム", p.width / 2, 60);

    p.textSize(20);
    p.text("難易度をえらんでね", p.width / 2, 120);

    drawButton("やさしい", 170);
    drawButton("ふつう", 240);
    drawButton("むずかしい", 310);
  }

  function drawButton(label, y) {
    p.fill(100, 200, 255);
    p.rect(p.width / 2 - 80, y, 160, 50, 10);

    p.fill(0);
    p.textSize(24);
    p.text(label, p.width / 2, y + 25);
  }

  // -----------------------------
  // プレイ画面
  // -----------------------------
  function drawPlayScreen() {

    if (flash > 0) {
      p.background(255, 255, 150);
      flash--;
    } else if (missFlash > 0) {
      p.background(255, 150, 150);
      missFlash--;
    } else {
      p.background(255);
    }

    drawCharacter(currentDifficulty, happy, sad);

    // ★ 長い単語は自動で縮小
    let size = 32;
    p.textSize(size);
    while (p.textWidth(current.word) > 300) {
      size -= 2;
      p.textSize(size);
    }

    p.fill(0);
    p.text(current.word, p.width / 2, 260);

    p.textSize(24);
    p.text("入力: " + userInput, p.width / 2, 310);

    p.textSize(18);
    p.text("スコア: " + score, p.width / 2, 350);

    // ★ 難易度ごとの最高スコア
    p.text("さいこうスコア: " + bestScores[currentDifficulty], p.width / 2, 390);

    let elapsed = Math.floor((p.millis() - startTime) / 1000);
    let remaining = timeLimit - elapsed;

    if (remaining <= 0) {
      remaining = 0;
      finishGame();
    }

    p.textSize(20);
    p.text("のこり時間: " + remaining + "秒", p.width / 2, 30);
  }

  // -----------------------------
  // 結果画面
  // -----------------------------
  function drawResultScreen() {
    p.background(255);

    p.textSize(32);
    p.fill(0);
    p.text("じかんぎれ！", p.width / 2, 150);

    p.text("スコア: " + score, p.width / 2, 200);
    p.text("さいこうスコア: " + bestScores[currentDifficulty], p.width / 2, 250);

    drawButton("もういちど", 300);
  }

  // -----------------------------
  // ゲーム開始
  // -----------------------------
  function startGame() {
    mode = "play";
    score = 0;
    startTime = p.millis();
    nextQuestion();

    setTimeout(() => {
      document.getElementById("typingInput").focus();
    }, 50);
  }

  // -----------------------------
  // ゲーム終了
  // -----------------------------
  function finishGame() {
    mode = "result";

    if (score > bestScores[currentDifficulty]) {
      bestScores[currentDifficulty] = score;
      localStorage.setItem("bestScore_" + currentDifficulty, score);
    }
  }

  // -----------------------------
  // 再スタート（難易度選択に戻る）
  // -----------------------------
  function restartGame() {
    mode = "start";
    score = 0;
    userInput = "";
  }

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
    current = p.random(currentWords);
    userInput = "";
  }

  // -----------------------------
  // キャラ描画（画像版）
  // -----------------------------
  function drawCharacter(difficulty, isHappy, isSad) {
    let imgSet = characterImages[difficulty];

    let img = imgSet.neutral;
    if (isHappy) img = imgSet.happy;
    if (isSad)   img = imgSet.sad;

    p.image(img, 100, 20, 200, 200);

    if (isHappy) {
      happyTimer--;
      if (happyTimer <= 0) happy = false;
    }
    if (isSad) {
      sadTimer--;
      if (sadTimer <= 0) sad = false;
    }
  }

});
