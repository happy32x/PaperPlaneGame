var SCORE = 5
var rotateLeft = false
var rotateRight = false 

var myGamePiece = null;
var myGameBonus = null;
var myScoreScreen = null;
var myGameOverScreen = null;
var myObstacles = [];
var myScore = null;
var touchObstacle = false;
var bonusTaked = false;

var myObstaclesAlreadyTouched = []
var ray = null;

var red = 255,
    blue = 255,
    green = 0,    
    blink = true;

const CANVAS_WIDTH = 512;
const CANVAS_HEIGHT = 768;

function collisionDetection() {
  var distance;
  var distanceX;
  var distanceY;

  for(var i=0; i<myObstacles.length; i++) {

    if(!myObstaclesAlreadyTouched.includes(i)) {
      if(myObstacles[i].x - myGamePiece.x < 0) {
        distanceX = myGamePiece.x - myObstacles[i].x        
      } else if (myObstacles[i].x - myGamePiece.x > 0) {
        distanceX = myObstacles[i].x - myGamePiece.x        
      } else {
        distanceX = 0
      }

      if(myObstacles[i].y - myGamePiece.y < 0) {
        distanceY = myGamePiece.y - myObstacles[i].y        
      } else if (myObstacles[i].y - myGamePiece.y > 0) {
        distanceY = myObstacles[i].y - myGamePiece.y        
      } else {
        distanceY = 0
      }

      distance = Math.sqrt( Math.pow(distanceX,2) + Math.pow(distanceY,2) )

      if(distance < ray) {        
        touchObstacle = true
        myObstaclesAlreadyTouched.push(i)
        SCORE--
        if(SCORE <= 0) {          
          myGameArea.pause()
          return
        }
      }   
    }   
  }
}

function initializeKeyHandling() {
  document.addEventListener("keydown", function(event) {
    var x = event.which || event.keyCode;  
    var arrowKeyTab = [37, 38, 39, 40]
    
    if(arrowKeyTab.includes(x)) { 
      switch(x) {
        case 37:
          rotateLeft = true
          rotateRight = false 
          myGamePiece.setSpeedX(-2)
          break;
        case 39:
          rotateLeft = false
          rotateRight = true 
          myGamePiece.setSpeedX(2)
          break;
        default:
          rotateLeft = false
          rotateRight = false 
      } 
    } else {
      myGamePiece.getTop()
    }
    console.log("The Unicode value is: " + x)
  })

  document.addEventListener("keyup", function(event) {
    rotateLeft = false
    rotateRight = false 
  })
}

function initializeObstacles() {  
  myObstacles = []
  myObstaclesAlreadyTouched = []

  //Number
  let numberMax = 10
  let numberMin = 5
  let number = Math.floor(Math.random()*(numberMax-numberMin+1)+numberMin);
  
  //Size
  let sizeMax = 60
  let sizeMin = 10
  let size = Math.floor(Math.random()*(sizeMax-sizeMin+1)+sizeMin);
  ray = size

  //Color
  let colorList = ["red", "blue", "green", "yellow", "gray"]
  let colorIndex = Math.floor(Math.random()*((colorList.length-1)-0+1)+0);
  let color = colorList[colorIndex]

  const CANVAS_WIDTH = 512;
  const CANVAS_HEIGHT = 768;  

  for (i = 0; i < number; i += 1) {         
    //PositionX
    let positionX = Math.floor(Math.random()*((CANVAS_WIDTH)-(0)+1)+(0));

    //PositionY
    let positionY = Math.floor(Math.random()*((CANVAS_HEIGHT)-(0)+1)+(0));
    
    myObstacles.push(new component(size, size, color, positionX, positionY, "barriers"));   
  }
}

function updateObstacles() {
  for (i = 0; i < myObstacles.length; i += 1) {           
    myObstacles[i].update();        
  }
}

function initializeBonus() {
  let positionX = Math.floor(Math.random()*((CANVAS_WIDTH)-(0)+1)+(0));
  let positionY = Math.floor(Math.random()*((CANVAS_HEIGHT)-(0)+1)+(0));
  myGameBonus = new component(25/2, 25/2, "white", positionX, positionY, "bonus");
}

function bonusDetection() {
  var distance;
  var distanceX;
  var distanceY;

      if(myGameBonus.x - myGamePiece.x < 0) {
        distanceX = myGamePiece.x - myGameBonus.x        
      } else if (myGameBonus.x - myGamePiece.x > 0) {
        distanceX = myGameBonus.x - myGamePiece.x        
      } else {
        distanceX = 0
      }

      if(myGameBonus.y - myGamePiece.y < 0) {
        distanceY = myGamePiece.y - myGameBonus.y        
      } else if (myGameBonus.y - myGamePiece.y > 0) {
        distanceY = myGameBonus.y - myGamePiece.y        
      } else {
        distanceY = 0
      }

      distance = Math.sqrt( Math.pow(distanceX,2) + Math.pow(distanceY,2) )

      if(distance < 25/2) {        
        bonusTaked = true        
        SCORE += 5        
      }   
    
}

function startGame() {
    myGamePiece = new component(30, 30, "white", 0, 0, "piece");
    myGamePiece.gravity = 0.0;        
    myScore = new component("30px", "Consolas", "white", 280, 40, "text"); 
    
    initializeObstacles()   
    initializeBonus()      
    myGameArea.start();
    initializeKeyHandling()
}

function scoreScreen() {   
  myGameOverScreen = new component("90px", "Consolas", "white", 20, (CANVAS_HEIGHT/2 - 50), "text");  
  myScoreScreen = new component("50px", "Consolas", "white", 20, (CANVAS_HEIGHT/2 + 50), "text"); 

  myGameOverScreen.text="Game Over";
  myGameOverScreen.update();

  myScoreScreen.text="Your Score is: " + SCORE;
  myScoreScreen.update();
}

var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = CANVAS_WIDTH;
        this.canvas.height = CANVAS_HEIGHT;
        this.context = this.canvas.getContext("2d");
        this.backgroundPattern = new Image();
        this.backgroundPattern.src = 'assets/img/brick.bmp';

        this.backgroundPattern.onload = () => {  
          for (var w = 0; w < this.canvas.width; w += this.backgroundPattern.width) {
            for (var h = 0; h < this.canvas.height; h  += this.backgroundPattern.height) {
                this.context.drawImage(this.backgroundPattern, w, h);
            }
          } 
        }         

        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
        },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (var w = 0; w < this.canvas.width; w += this.backgroundPattern.width) {
          for (var h = 0; h < this.canvas.height; h  += this.backgroundPattern.height) {
              this.context.drawImage(this.backgroundPattern, w, h);
          }
        }  
    },
    pause : function() {
      clearInterval(this.interval);
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

      for (var w = 0; w < this.canvas.width; w += this.backgroundPattern.width) {
        for (var h = 0; h < this.canvas.height; h  += this.backgroundPattern.height) {
            this.context.drawImage(this.backgroundPattern, w, h);
        }
      }     
      
      scoreScreen()
    }
}

function component(width, height, color, x, y, type) {
    this.type = type;
    this.score = 0;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 3;
    this.x = x;
    this.y = y;

    if (this.type == "piece") {
      this.x = x - width/2 + CANVAS_WIDTH/2;
      this.y = y - height;
    }
    
    this.gravity = 0;
    this.gravitySpeed = 0;
    this.update = function() {
        ctx = myGameArea.context;
        if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
            ctx.setTransform(1, 0, 0, 1, 0, 0)
        } else if (this.type == "piece") { 
            
            ctx.translate(-10, -10);

            let x = this.x, 
                y = this.y            
                
            //Rotate Left
            if(rotateLeft){    
              let lx = x + 10,
                  ly = y + 10 
              ctx.translate(lx, ly);
              ctx.rotate((Math.PI / 180) * 15);
              lx = -x - 10
              ly = -y - 10
              ctx.translate(lx, ly);           
            } else if(rotateRight){ //Rotate Right
              let lx = x + 10,
                  ly = y + 10 
              ctx.translate(lx, ly);
              ctx.rotate((Math.PI / 180) * -15);
              lx = -x - 10
              ly = -y - 10
              ctx.translate(lx, ly);                                  
            } else {
              
            }
            
            ctx.beginPath();
            ctx.moveTo(x, y);
            
            x += 20
            ctx.lineTo(x, y);
            x -= 10
            y += 20
            ctx.lineTo(x, y);
            ctx.closePath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = 'black';
            ctx.stroke();    
            ctx.fillStyle = "white";
            ctx.fill();
            
            ctx.rotate((Math.PI / 180) *0)
            ctx.setTransform(1, 0, 0, 1, 0, 0)

        } else if (this.type == "barriers") {    

            ctx.beginPath();
            ctx.arc(this.x, this.y, this.width, 0, 2 * Math.PI, false);
            ctx.fillStyle = color;
            ctx.fill();
            ctx.lineWidth = 2;
            ctx.strokeStyle = 'black';
            ctx.stroke();

            ctx.setTransform(1, 0, 0, 1, 0, 0)
        } else if (this.type == "bonus") {    
          
          if(blink) {
            blue--
            green++ 
            if(blue <= 0) blink = false          
          } else {
            blue++
            green-- 
            if(blue >= 255) blink = true           
          }                  
          
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.width, 0, 2 * Math.PI, false);
          ctx.fillStyle = 'rgb('+ 0 +','+ green +','+ blue +')';
          ctx.fill();
          ctx.lineWidth = 2;
          ctx.strokeStyle = 'black';
          ctx.stroke();                                                   
    
          ctx.setTransform(1, 0, 0, 1, 0, 0)
      }
    }
    this.newPos = function() {        
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.type == "piece") {
          this.hitBottom();
          this.hitSide();
        }        
    }
    this.setSpeedX = function(speedX) {      
      this.x += speedX;
      this.y += this.speedY;      
    }
    this.hitBottom = function() {  
        var limitbottom = myGameArea.canvas.height;
        if (this.y - 10 > limitbottom) {
            this.y = 0 - 20;

            if(touchObstacle) {
              touchObstacle = false
            } else {
              SCORE++
            }            
            initializeObstacles() 
            if(!bonusTaked) initializeBonus()
        }
    }
    this.hitSide = function() {  
      var limitRight = myGameArea.canvas.width;
      if (this.x - 10 < 0) {
          this.x = 10;            
      } else if (this.x + 10 > limitRight) {
        this.x = limitRight - 10;
      }
    }
    this.getTop = function() {        
        this.y = 0 - height;            
    }  
    this.crashWith = function(otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
}
function updateGameArea() {    
    myGameArea.clear();
    myGameArea.frameNo += 1;    
    
    myGamePiece.newPos();
    myGamePiece.update();        

    updateObstacles()

    if(!bonusTaked) myGameBonus.update();  

    myScore.text="SCORE: " + SCORE;
    myScore.update();

    collisionDetection()
    if(!bonusTaked) bonusDetection()
}

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
    return false;
}

function accelerate(n) {
    myGamePiece.gravity = n;
}