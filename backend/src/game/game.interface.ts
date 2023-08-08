export interface IGameData {
  player1Id: number;
  player2Id: number;
  player1Score: number;
  player2Score: number;
  width: number;
  height: number;
  padWidth: number;
  padHeight: number;
  ballRadius: number;
  leftPad: number;
  rightPad: number;
  ballX: number;
  ballY: number;
  velocityX: number;
  velocityY: number;
  padVelocity: number;
  padWallSeparation: number;
}
