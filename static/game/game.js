const CELL_SIZE = 50;
let GRID_COLS = 0;
let GRID_ROWS = 0;
let grid = [];

let gameState;

let baseMapImg;
let girlfriendImg;
let clownImg;

let clownSound1Snd;
let clownSound2Snd;
let clownSeesYouSnd;
let gfMoveSnd;
let loseSnd;
let unlockDoorSnd;
let useKnifeSnd;
let messageSnd;

let successSnd;

let isSoundOn = true;
  


const soundIcon = document.getElementById("soundIcon");
const bgMusic = document.getElementById("bgMusic");

const mistralAPI = new MistralAPI();

let chatMessages = [];

let furnitureSprites = {};

function preload() {
  clownSound1Snd = loadSound('/assets/sounds/clownmove1.mp3');
  clownSound2Snd = loadSound('/assets/sounds/clownmove2.mp3');
  clownSeesYouSnd = loadSound('/assets/sounds/clownseesyou.mp3');
  gfMoveSnd = loadSound('/assets/sounds/gfmove.mp3');
  loseSnd = loadSound('/assets/sounds/lose.mp3');
  unlockDoorSnd = loadSound('/assets/sounds/unlockdoor.mp3');
  useKnifeSnd = loadSound('/assets/sounds/useknife.mp3');
  messageSnd = loadSound('/assets/sounds/message.wav');
  successSnd = loadSound('/assets/sounds/success.mp3');
}

async function initializeChat() {
  const firstPrompt = gameState.getFirstPrompt();
  const messages = [
    {
      role: "system",
      content: firstPrompt,
    },
  ];
  try {
    const response = await mistralAPI.sendMessage(messages);
    const jsonResponse = JSON.parse(response);
    addMessageToChat("assistant", jsonResponse.textMessage);
  } catch (error) {
    console.error("Error getting initial message:", error);
  }
}

async function setup() {

         // Vérifier si c'est la première visite
         if (localStorage.getItem("isSoundOn") === null) {
          // Première visite : initialiser avec le son activé
          localStorage.setItem("isSoundOn", "true");
        } else {
          // Visites suivantes : récupérer l'état précédent
          isSoundOn = localStorage.getItem("isSoundOn") == "true";
        }


  setStressLevel('no');

  baseMapImg = loadImage("/assets/img/appartment/basemap.png");
  girlfriendImg = loadImage("/assets/img/gf.png");
  clownImg = loadImage("/assets/img/clown.png");

  gameState = new GameState({
    ...getApt(),
    grid: getGrid(),
    furniture: getFurniture(),
  });

  furnitureSprites = loadFurnitureSprites(gameState.map_data.furniture);

  GRID_COLS = gameState.map_data.gridCols;
  GRID_ROWS = gameState.map_data.gridRows;

  girlfriend = new Girlfriend(gameState, girlfriendImg);
  clown = new Clown(gameState, clownImg);

  // Once loaded, initialize the P5 canvas with correct dims
  let canvas = createCanvas(GRID_COLS * CELL_SIZE, GRID_ROWS * CELL_SIZE);
  canvas.parent("mapWrapper");
  adjustScale();
  
  await initializeChat();
}

function draw() {
  clear();

  if (baseMapImg) {
    image(baseMapImg, 0, 0, GRID_COLS * CELL_SIZE, GRID_ROWS * CELL_SIZE);
  }
  if (furnitureSprites) {
    drawFurniture(gameState.map_data.furniture, furnitureSprites);
  }
  //drawGrid();
  // drawWallsAndDoors();

    drawLabels(gameState.map_data.rooms);



  if (girlfriend) {
    //girlfriend.drawPath(CELL_SIZE);
    girlfriend.draw(CELL_SIZE);
  }
  if (clown) {
    clown.checkForGirlfriend(girlfriend);
    //clown.drawPath(CELL_SIZE);
    clown.draw(CELL_SIZE);
  }

  gameState.update();

  if (gameState.game_over) {
    noLoop();
  }
}
