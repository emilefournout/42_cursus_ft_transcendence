export class GameDataOptions {
  maxGoals: number;
  speed: number;
  powerUps: boolean;
}
export class GameData {
  private player1Id: number;
  private player2Id: number;
  private player1Score: number = 0;
  private player2Score: number = 0;
  private finished: boolean = false;
  private maxGoals: number = 5;
  private width: number = 600;
  private height: number = 350;
  private padWidth: number = 10;
  private padHeight: number = 60;
  private ballRadius: number = 8;
  private leftPad: number = Math.random() * (this.height - this.padHeight);
  private rightPad: number = Math.random() * (this.height - this.padHeight);
  private ballX: number = 200;
  private ballY: number = 150;
  private padVelocity: number = 30;
  private padWallSeparation: number = 20;
  private velocityX: number = 3;
  private velocityY: number = 3;
  private powerUps: boolean = false;

  constructor(player1Id:number,  player2Id:number, gameOptions?: GameDataOptions)
  {
    this.player1Id = player1Id
    this.player2Id = player2Id
    if (gameOptions)
    {
      this.maxGoals = gameOptions.maxGoals
      this.velocityX = gameOptions.speed * 3
      this.velocityY = gameOptions.speed * 3
      this.powerUps = gameOptions.powerUps
    }
  }

  
  public get isFinished() : boolean {
    return this.finished
  }
  
  public get firstPlayerId() : number {
    return this.player1Id
  }
  
  public get secondPlayerId() : number {
    return this.player2Id
  }

  public get firstPlayerScore() : number {
    return this.player1Score
  }
  
  public get secondPlayerScore() : number {
    return this.player2Score
  }

  public get goalsLimit(): number
  {
    return this.maxGoals;
  }

  public get loser() : number {
    if (this.isFinished)
    {
      if (this.player1Id < this.player2Id)
        return this.player1Id
      else
        return this.player2Id
    }
    return -1
  }
  
  public get winner() : number {
    if (this.isFinished)
    {
      if (this.player1Id >= this.player2Id)
        return this.player1Id
      else
        return this.player2Id
    }
    return -1
  }
  
  move(direction: string, playerId: number) {
    if (this.player1Id === playerId) {
      if (
        direction === 'down' &&
        this.leftPad + this.padVelocity + this.padHeight <
          this.height
      )
        this.leftPad += this.padVelocity;
      else if (
        direction === 'up' &&
        this.leftPad - this.padVelocity > 0
      )
        this.leftPad -= this.padVelocity;
    } else if (this.player2Id === playerId) {
      if (
        direction === 'down' &&
        this.rightPad + this.padVelocity + this.padHeight <
          this.height
      )
        this.rightPad += this.padVelocity;
      else if (
        direction === 'up' &&
        this.rightPad - this.padVelocity > 0
      )
        this.rightPad -= this.padVelocity;
    }
  }

  updateBall() {
    this.ballX += this.velocityX;
    this.ballY += this.velocityY;
    if (this.checkOutsideCanva()) {
      this.velocityY = -this.velocityY;
    } else if (this.checkLeftPadCollision()) {
      this.velocityX = -this.velocityX;
      this.ballX = this.padWallSeparation + this.padWidth;
    } else if (this.checkRightPadCollision()) {
      this.velocityX = -this.velocityX;
      this.ballX =
        this.width - this.padWallSeparation - this.padWidth;
    } else if (this.ballX + this.ballRadius > this.width) {
      this.increasePlayer1Score();
      this.ballX = 400;
      this.ballY = 150;
      this.velocityX = -(Math.random() + 3);
      this.velocityY = Math.random() + 3;
    } else if (this.ballX - this.ballRadius < 0) {
      this.increasePlayer2Score();
      this.ballX = 200;
      this.ballY = 150;
      this.velocityX = Math.random() + 3;
      this.velocityY = Math.random() + 3;
    }
  }

  private checkOutsideCanva() {
    return (
      this.ballY + this.ballRadius > this.height ||
      this.ballY - this.ballRadius < 0
    );
  }

  private checkLeftPadCollision(): boolean {
    return (
      this.ballX + this.ballRadius >= this.padWallSeparation && // Desde la izquierda
      this.ballX - this.ballRadius <=
        this.padWallSeparation + this.padWidth && // Desde la derecha
      this.ballY >= this.leftPad &&
      this.ballY <= this.leftPad + this.padHeight &&
      this.velocityX < 0
    );
  }

  private checkRightPadCollision() {
    return (
      this.ballX + this.ballRadius >=
        this.width - this.padWallSeparation - this.padWidth && // Desde la izquierda
      this.ballX - this.ballRadius <=
        this.width - this.padWallSeparation && // Desde la derecha
      this.velocityX > 0 &&
      (this.ballY - this.ballRadius >= this.rightPad ||
        this.ballY + this.ballRadius >= this.rightPad) &&
      (this.ballY + this.ballRadius <=
        this.rightPad + this.padHeight ||
        this.ballY - this.ballRadius <=
          this.rightPad + this.padHeight)
    );
  }
  private increasePlayer1Score() {
    this.player1Score += 1
    if (this.player1Score >= this.maxGoals)
      this.finish()
  }

  private increasePlayer2Score() {
    this.player2Score += 1
    if (this.player2Score >= this.maxGoals)
      this.finish()
  }
  
  finish() {
    this.finished = true
  }  
}


