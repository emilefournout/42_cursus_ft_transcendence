export class GameDataOptions {
  maxGoals: number;
  speed: number;
  powerUps: boolean;
}

enum BallSize {
  Small = 5,
  Normal = 8,
  Big = 15
}
export class GameData {
  private readonly padHeight: number = 60;
  private player1Id: number;
  private player2Id: number;
  private player1Score = 0;
  private player2Score = 0;
  private finished = false;
  private maxGoals = 5;
  private width = 600;
  private height = 350;
  private padWidth = 10;
  private leftPadHeight = 60;
  private rightPadHeight = 60;
  private ballRadius: number = BallSize.Normal;
  private leftPad: number = Math.random() * (this.height - this.leftPadHeight);
  private rightPad: number =
    Math.random() * (this.height - this.rightPadHeight);
  private ballX = 200;
  private ballY = 150;
  private padVelocity = 30;
  private padWallSeparation = 20;
  private velocityX = 3;
  private velocityY = 3;
  private powerUps = false;

  constructor(
    player1Id: number,
    player2Id: number,
    gameOptions?: GameDataOptions
  ) {
    this.player1Id = player1Id;
    this.player2Id = player2Id;
    if (gameOptions) {
      this.maxGoals = gameOptions.maxGoals;
      this.velocityX = gameOptions.speed * 3;
      this.velocityY = gameOptions.speed * 3;
      this.powerUps = gameOptions.powerUps;
    }
  }

  public get isFinished(): boolean {
    return this.finished;
  }

  public get firstPlayerId(): number {
    return this.player1Id;
  }

  public get secondPlayerId(): number {
    return this.player2Id;
  }

  public get firstPlayerScore(): number {
    return this.player1Score;
  }

  public get secondPlayerScore(): number {
    return this.player2Score;
  }

  public get goalsLimit(): number {
    return this.maxGoals;
  }

  public get loser(): number {
    if (this.isFinished) {
      if (this.player1Id < this.player2Id) return this.player1Id;
      else return this.player2Id;
    }
    return -1;
  }

  public get winner(): number {
    if (this.isFinished) {
      if (this.player1Score >= this.player2Score) return this.player1Id;
      else return this.player2Id;
    }
    return -1;
  }

  move(direction: string, playerId: number) {
    if (this.player1Id === playerId) {
      if (direction === 'down') {
        if (this.leftPad + this.padVelocity + this.leftPadHeight < this.height)
          this.leftPad += this.padVelocity;
        else this.leftPad = this.height - this.leftPadHeight;
      } else if (direction === 'up') {
        if (this.leftPad - this.padVelocity > 0)
          this.leftPad -= this.padVelocity;
        else this.leftPad = 0;
      }
    } else if (this.player2Id === playerId) {
      if (direction === 'down') {
        if (
          this.rightPad + this.padVelocity + this.rightPadHeight <
          this.height
        )
          this.rightPad += this.padVelocity;
        else this.rightPad = this.height - this.rightPadHeight;
      } else if (direction === 'up') {
        if (this.rightPad - this.padVelocity > 0)
          this.rightPad -= this.padVelocity;
        else this.rightPad = 0;
      }
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
      this.ballX = this.width - this.padWallSeparation - this.padWidth;
    } else if (this.ballX + this.ballRadius > this.width) {
      this.increasePlayerScore(1);
      this.ballX = 400;
      this.ballY = 150;
      this.velocityX = -(Math.random() + 3);
      this.velocityY = Math.random() + 3;
    } else if (this.ballX - this.ballRadius < 0) {
      this.increasePlayerScore(2);
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
      this.ballX - this.ballRadius <= this.padWallSeparation + this.padWidth && // Desde la derecha
      this.ballY >= this.leftPad &&
      this.ballY <= this.leftPad + this.leftPadHeight &&
      this.velocityX < 0
    );
  }

  private checkRightPadCollision() {
    return (
      this.ballX + this.ballRadius >=
        this.width - this.padWallSeparation - this.padWidth && // Desde la izquierda
      this.ballX - this.ballRadius <= this.width - this.padWallSeparation && // Desde la derecha
      this.velocityX > 0 &&
      (this.ballY - this.ballRadius >= this.rightPad ||
        this.ballY + this.ballRadius >= this.rightPad) &&
      (this.ballY + this.ballRadius <= this.rightPad + this.rightPadHeight ||
        this.ballY - this.ballRadius <= this.rightPad + this.rightPadHeight)
    );
  }

  private increasePlayerScore(playerNumber: 1 | 2) {
    if (playerNumber === 1) {
      this.player1Score += 1;
      if (this.player1Score >= this.maxGoals) this.finish();
    } else {
      this.player2Score += 1;
      if (this.player2Score >= this.maxGoals) this.finish();
    }
    if (this.powerUps) {
      this.checkAndGiveAdvantage();
      this.randomizeBallSize();
    }
  }

  private randomizeBallSize() {
    const rand = Math.floor(Math.random() * 3);
    switch (rand) {
      case 0:
        this.ballRadius = BallSize.Small;
        break;
      case 1:
        this.ballRadius = BallSize.Normal;
        break;
      case 2:
        this.ballRadius = BallSize.Big;
        break;
      default:
        break;
    }
  }

  private checkAndGiveAdvantage() {
    if (Math.abs(this.player1Score - this.player2Score) >= 3) {
      if (this.player1Score < this.player2Score) this.giveAdvantagePlayer1();
      else this.giveAdvantagePlayer2();
    } else {
      this.leftPadHeight = this.padHeight;
      this.rightPadHeight = this.padHeight;
    }
  }

  private giveAdvantagePlayer1() {
    if (this.leftPadHeight === this.padHeight * 1.5) return;
    if (this.padHeight * 1.5 + this.leftPad <= this.height) {
      this.leftPadHeight = this.padHeight * 1.5;
    } else {
      const difference = this.padHeight * 1.5 + this.leftPad - this.height;
      this.leftPad -= difference;
      this.leftPadHeight = this.padHeight * 1.5;
    }
  }

  private giveAdvantagePlayer2() {
    if (this.rightPadHeight === this.padHeight * 1.5) return;
    if (this.padHeight * 1.5 + this.rightPad <= this.height) {
      this.rightPadHeight = this.padHeight * 1.5;
    } else {
      const difference =
        this.rightPadHeight * 1.5 + this.rightPad - this.height;
      this.rightPad -= difference;
      this.rightPadHeight = this.padHeight * 1.5;
    }
  }

  finish() {
    this.finished = true;
  }
}
