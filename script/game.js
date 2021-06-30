let lv = 0;

let points = 0;

let life = 2;

let strpills;

function creatBord() {
  let menu = document.querySelector(".menu");
  document.getElementById("bodyId").removeChild(menu);

  const newDiv = document.createElement("div");
  newDiv.className = "game-field";
  newDiv.innerHTML =
    '<div class="field">\
      <div class="ball"></div>\
      <div class="border-top"></div>\
      <div class="border-botom">\
        <div class="border-side border-left"></div>\
        <div class="fild-do">\
          <div class="field__block">\
          </div>\
          <div class="field__user">\
            <div class="field__platform">\
              <div class="platform"></div>\
            </div>\
            <div class="game_over"></div>\
          </div>\
        </div>\
        <div class="border-side border-right"></div>\
      </div>\
    </div>\
    <div class="info">\
      <div class="points">\
        <div>POINTS</div>\
        <div class="points_val"></div>\
      </div>\
      <div class="life">\
        <div>life</div>\
        <div class="life_val"></div>\
       </div>\
    </div>';

  bodyId.append(newDiv);

  addBlock(lv);

  start();
}

let level = [
  [
    [1, 1, 1, 1],
    [2, 2, 2, 2],
    [3, 3, 3, 3],
  ],
  [
    [3, 3, 3, 3],
    [2, 2, 2, 2],
    [1, 1, 1, 1],
  ],
  [
    [3, 1, 3, 1],
    [2, 2, 2, 2],
    [1, 3, 1, 3],
  ],
  [
    [3, 2, 2, 3],
    [3, 2, 2, 3],
    [1, 1, 1, 1],
  ],
];

function addBlock(lv) {
  let block = document.querySelector(".field__block");
  let arr = level[lv];
  for (let i = 0; i < arr.length; i++) {
    let bricksContainer = document.createElement("div");
    bricksContainer.className = "row-block";
    block.append(bricksContainer);
    let rows = arr[i];
    for (let j = 0; j < rows.length; j++) {
      let brick = document.createElement("div");

      if (rows[j] === 1) {
        brick.className = "block full block_red";
      } else if (rows[j] === 2) {
        brick.className = "block full block_green";
      } else if (rows[j] === 3) {
        brick.className = "block full block_gold";
      }
      bricksContainer.append(brick);
    }
  }
}

function start() {
  function displayInfo() {
    const point = document.querySelector(".points_val");
    point.innerHTML = `${points}`;
    const lif = document.querySelector(".life_val");
    lif.innerHTML = `${life}`;
  }

  const ball = {
    div: document.querySelector(".ball"),
    x: 0,
    y: 0,
    width() {
      let rectBall = ball.div.getBoundingClientRect();
      return rectBall.width;
    },
    height() {
      let rectBall = ball.div.getBoundingClientRect();
      return rectBall.height;
    },
  };

  function AvailabilityBlock() {
    const arrAvailabilityBlock = [];
    const div = document.querySelectorAll("div.block");
    for (let i = 0; i < div.length; i++) {
      const arrDiv = div[i];
      const AvailabilityBlock = arrDiv.classList.contains("full");
      arrAvailabilityBlock.push(AvailabilityBlock);
    }
    let AvailabilityBlock = arrAvailabilityBlock.includes(true);
    console.log(AvailabilityBlock);

    if (AvailabilityBlock === false) {
      lv += 1;
      clearTimeout(timerId);
      const fildDo = document.querySelector(".fild-do");
      const fieldBlock = document.querySelector(".field__block");
      fildDo.removeChild(fieldBlock);
      const newDiv = document.createElement("div");
      newDiv.className = "field__block";
      fildDo.prepend(newDiv);
      addBlock(lv);
      start();
    }
  }

  let fieldPlatform = document.querySelector(".field__platform");
  let rectField = fieldPlatform.getBoundingClientRect();
  let fieldY = rectField.y;
  let widthField = rectField.width;
  let heightField = rectField.height;
  let minField = rectField.x;
  let maxField = widthField + minField;

  let platform = document.querySelector(".platform");
  let rectPlatform = platform.getBoundingClientRect();
  let widthPlatform = rectPlatform.width;
  let halfPlatform = widthPlatform / 2;
  let sumPlatform = minField + halfPlatform;

  let field = document.querySelector(".fild-do");
  let rectFieldDo = field.getBoundingClientRect();
  let rectFieldDoY = rectFieldDo.y;

  let mouseX = 0;

  let currentYBall = 0;
  let pageYBall = 0;

  let currentXBall = 0;
  let pageXBall = 0;

  let ballFlying = false;

  let ballFlyingTop = true;
  let ballFlyingLeft = true;

  function collicion() {
    let ball = coordinatBall();
    let div = coordinatDiv();

    for (let i = 0; i < div.length; i++) {
      let elem = div[i];

      // правая коллизия
      if (
        ball[2] <= elem[3] &&
        ball[3] >= elem[2] &&
        ball[0] <= elem[1] &&
        ball[0] > elem[1] - 8
      ) {
        ballFlyingLeft = true;
        points += 100;
        collisionBlock(i);
      }
      // левая коллизия
      if (
        ball[2] <= elem[3] &&
        ball[3] >= elem[2] &&
        ball[1] >= elem[0] &&
        ball[1] < elem[0] + 8
      ) {
        ballFlyingLeft = false;
        points += 100;
        collisionBlock(i);
      }
      //верхняя коллизия
      if (
        ball[1] >= elem[0] &&
        ball[0] <= elem[1] &&
        ball[3] >= elem[2] &&
        ball[3] < elem[2] + 8
      ) {
        ballFlyingTop = true;
        points += 100;
        collisionBlock(i);
      }
      //нижняя коллизия
      if (
        ball[1] >= elem[0] &&
        ball[0] <= elem[1] &&
        ball[2] <= elem[3] &&
        ball[2] > elem[3] - 8
      ) {
        ballFlyingTop = false;
        points += 100;
        collisionBlock(i);
      }
    }
  }

  function collisionBlock(i) {
    let div = document.querySelectorAll("div.full");
    let goldBlock = div[i].classList.contains("block_gold");
    let greenBlock = div[i].classList.contains("block_green");
    let redBlock = div[i].classList.contains("block_red");

    if (goldBlock) {
      div[i].classList.remove("block_gold");
      div[i].classList.add("block_green");
    }
    if (greenBlock) {
      div[i].classList.remove("block_green");
      div[i].classList.add("block_red");
    }
    if (redBlock) {
      div[i].classList.remove("block_red");
      div[i].classList.remove("full");
      div[i].classList.add("empty_block");
    }
  }

  function collicionBorder() {
    const borderFild = document.querySelector(".fild-do");
    const border = borderFild.getBoundingClientRect();
    const borderLeft = border.x;
    const borderRight = borderLeft + border.width;
    const borderTop = border.y;
    const overDiv = document.querySelector(".game_over");
    const over = overDiv.getBoundingClientRect();
    const gameOver = over.y;

    const ball = coordinatBall();

    if (ball[0] <= borderLeft) {
      ballFlyingLeft = true;
    }
    if (ball[1] >= borderRight) {
      ballFlyingLeft = false;
    }
    if (ball[2] <= borderTop) {
      ballFlyingTop = false;
    }
    if (ball[3] >= gameOver) {
      if (life <= 0) {
        clearTimeout(timerId);
        const newDiv = document.createElement("div");
        newDiv.className = "over";
        newDiv.innerHTML = "GAME OVER";
        const fil = document.querySelector(".fild-do");
        fil.append(newDiv);
      } else {
        clearTimeout(timerId);
        start();
        life -= 1;
      }
    }
  }

  function coordinatDiv() {
    const elements = document.querySelectorAll("div.full");

    let result = [];
    elements.forEach(function (e) {
      let arry = [];

      let rect = e.getBoundingClientRect();
      let x = rect.x;
      let maxX = x + rect.width;
      let y = rect.y;
      let maxY = y + rect.height;
      arry.push(x, maxX, y, maxY);

      result.push(arry);
    });
    return result;
  }

  function coordinatBall() {
    let arrCoordinatBall = [];
    let coordinatXBall = currentXBall + minField;
    let coordinatWidhtBall = coordinatXBall + ball.width();
    let coordinatYBall = currentYBall + 8;
    let coordinatheightBall = coordinatYBall + ball.height();
    arrCoordinatBall.push(
      coordinatXBall,
      coordinatWidhtBall,
      coordinatYBall,
      coordinatheightBall
    );

    return arrCoordinatBall;
  }

  function collicionPlatform() {
    let platform = document.querySelector(".platform");
    let rectPlatform = platform.getBoundingClientRect();
    let platformX = rectPlatform.x;
    let platformMaxX = platformX + rectPlatform.width;
    let platformY = rectPlatform.y;
    let platformMaxY = platformY + rectPlatform.height;

    let ball = coordinatBall();

    if (
      ball[0] <= platformMaxX &&
      ball[1] >= platformX &&
      ball[3] >= platformY
    ) {
      ballFlyingTop = true;
    }

    if (
      ball[3] >= platformY &&
      ball[3] <= platformMaxY &&
      ball[1] >= platformX &&
      ball[1] <= platformX + 8
    ) {
      ballFlyingTop = true;
      ballFlyingLeft = false;
    }

    if (
      ball[3] >= platformY &&
      ball[3] <= platformMaxY &&
      ball[0] <= platformMaxX &&
      ball[0] >= platformMaxX - 8
    ) {
      ballFlyingTop = true;
      ballFlyingLeft = true;
    }
  }

  let randPul = 0;
  let pullX = 0;
  let pulls = 0;

  function pul() {
    randomInteger();
    if (randPul === 50) {
      const fild = document.querySelector(".fild-do");
      const pull = document.createElement("div");
      pull.className = "pul";
      fild.append(pull);
      const coordinatPull = document.querySelector(".pul");

      pullX = mouseX - sumPlatform + (halfPlatform - ball.width() / 2);
      coordinatPull.style.left = pullX + "px";
      coordinatPull.style.top = rectFieldDoY + "px";
    }
  }

  function FlyingPul() {
    let arryPulls = pullCoord();
    for (let i = 0; i < arryPulls.length; i++) {
      let arrPull = arryPulls[i];

      let fall = arrPull[3] - 0.5;
      pulls.forEach(function (e) {
        e.style.top = fall + "px";
      });
    }
  }

  function pullCoord() {
    let arr = pulls;
    let result = [];
    arr.forEach(function (e) {
      let arry = [];

      let rect = e.getBoundingClientRect();
      let x = rect.x;
      let maxX = x + rect.width;
      let y = rect.y;
      let maxY = y + rect.height;
      arry.push(x, maxX, y, maxY);

      result.push(arry);
    });
    return result;
  }

  function randomInteger() {
    let rand = 0 + Math.random() * 100;
    randPul = Math.floor(rand);

    console.log(randPul);
  }

  function colliciaPulls() {
    let platform = document.querySelector(".platform");
    let rectPlatform = platform.getBoundingClientRect();
    let platformX = rectPlatform.x;
    let platformMaxX = platformX + rectPlatform.width;
    let platformY = rectPlatform.y;
    let platformMaxY = platformY + rectPlatform.height;

    let pullsCoordinat = pullCoord();

    for (let i = 0; i < pullsCoordinat.length; i++) {
      let elem = pullsCoordinat[i];
      if (
        platformX <= elem[1] &&
        platformMaxX >= elem[0] &&
        platformY <= elem[3] &&
        platformMaxY >= elem[2]
      ) {
        if (life <= 0) {
          clearTimeout(timerId);
          const newDiv = document.createElement("div");
          newDiv.className = "over";
          newDiv.innerHTML = "GAME OVER";
          const fil = document.querySelector(".fild-do");
          fil.append(newDiv);
        } else {
          clearTimeout(timerId);
          life -= 1;
          start();
        }
      }
    }
  }

  let timerId = setInterval(function staticBall() {
    displayInfo();

    if (lv >= strpills) {
      pulls = document.querySelectorAll("div.pul");
      randomInteger();
      pul();
      FlyingPul();
      colliciaPulls();
    }
    console.log("strpills", strpills);

    platform.style.left = mouseX - sumPlatform + "px";

    if (ballFlying) {
      if (ballFlyingTop === true) {
        currentYBall -= 2;
        pageYBall = currentYBall + "px";
        ball.div.style.top = pageYBall;
      }

      if (ballFlyingTop === false) {
        currentYBall += 2;
        pageYBall = currentYBall + "px";
        ball.div.style.top = pageYBall;
      }

      if (ballFlyingLeft === true) {
        currentXBall += 2;
        pageXBall = currentXBall + "px";
        ball.div.style.left = pageXBall;
      }

      if (ballFlyingLeft === false) {
        currentXBall -= 2;
        pageXBall = currentXBall + "px";
        ball.div.style.left = pageXBall;
      }
      collicion();
      collicionBorder();
      collicionPlatform();

      AvailabilityBlock();
    } else {
      currentYBall = fieldY - (heightField + ball.height());
      pageYBall = currentYBall + "px";
      ball.div.style.top = pageYBall;

      currentXBall = mouseX - sumPlatform + (halfPlatform - ball.width() / 2);
      pageXBall = currentXBall + "px";
      ball.div.style.left = pageXBall;
    }
  }, 1000 / 60);

  window.onmousemove = function (event) {
    mouseX = event.pageX;

    if (mouseX <= minField + halfPlatform) {
      mouseX = minField + halfPlatform;
    }
    if (mouseX >= maxField - halfPlatform) {
      mouseX = maxField - halfPlatform;
    }
  };

  document.body.children[0].onclick = function (e) {
    ballFlying = true;
  };
}

let customButton;
window.addEventListener("DOMContentLoaded", (event) => {
  customButton = document.getElementById("play");

  let e = document.getElementById("select");
  let result;

  e.addEventListener("change", () => {
    result = e.options[e.selectedIndex].value;
  });
  customButton.onclick = function () {
    strpills = result;
    creatBord();
  };
});
