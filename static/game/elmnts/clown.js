class Clown extends Character {
  constructor(gameState, clownImg) {
    super(gameState, clownImg);
    this.isChasing = false;
    this.targetGirlfriend = null;
    this.gameState.clown = this;
    this.startAutonomousBehavior();
    this.setCharacterPosition(this.gameState.map_data.clown_start_pos);

    // Add initial speed properties
    this.baseSpeed = 900; // Starting movement delay in milliseconds
    this.minSpeed = 300; // Fastest possible speed
    this.speedIncreaseInterval = 150000; // Speed increases every 30 seconds
    this.speedIncreaseAmount = 100; // How much to decrease delay each time

    // Start the speed increase timer
    this.startSpeedIncrease();
  }

  startAutonomousBehavior() {
    if (this.behaviorInterval) {
      clearInterval(this.behaviorInterval);
    }

    this.behaviorInterval = setInterval(() => {
      this.decideBehavior();
     playSound(Math.random() < 0.5 ? 'clownSound1' : 'clownSound2');

    }, 6000);
  }

  decideBehavior() {
    if (!this.isMoving) {
      const roomEntries = this.gameState.map_data.rooms.filter(room => room.name !== "Kitchen");

      if (this.targetGirlfriend && !this.gameState.girlfriend.isHiding) {
        const girlfriendPos = this.targetGirlfriend.getCharacterPosition();
        if (girlfriendPos) {
          this.path = this.findPath(this.characterPos, girlfriendPos);
          if (this.path.length > 0) {
            this.isChasing = true;
            this.moveCharacterAlongPath();
            return;
          }
        }
      }

      this.isChasing = false;
      this.targetGirlfriend = null;

      const randomRoom =
        roomEntries[Math.floor(Math.random() * roomEntries.length)];
      if (randomRoom) {
        this.path = this.findPath(this.characterPos, randomRoom.label_position);
        if (this.path.length > 0) {
          this.moveCharacterAlongPath();
        }
      }
    }
  }

  checkForGirlfriend(girlfriend) {
    // First check if girlfriend exists and has a position
    if (
      !this.gameState.girlfriend ||
      !this.characterPos ||
      this.gameState.girlfriend.isHiding || // Check if girlfriend is hiding
      this.gameState.girlfriend.getIsHiding() // Also check using the getter method
    ) {
      this.targetGirlfriend = null;
      this.isChasing = false; // Stop chasing if was chasing before
      return;
    }

    const girlfriendPos = this.gameState.girlfriend.getCharacterPosition();
    if (!girlfriendPos) return;

    // First check if in same room
    const clownRoom = this.getCurrentRoom();
    const girlfriendRoom = this.gameState.girlfriend.getCurrentRoom();

    if (clownRoom && girlfriendRoom && clownRoom === girlfriendRoom) {
      // Check if within 3 cells in any direction
      const xDistance = Math.abs(this.characterPos.x - girlfriendPos.x);
      const yDistance = Math.abs(this.characterPos.y - girlfriendPos.y);

      if (xDistance <= 3 && yDistance <= 3) {
        this.targetGirlfriend = girlfriend;
        // Immediately update path to chase
        if (!this.isChasing) {
          this.path = this.findPath(this.characterPos, girlfriendPos);
          if (this.path.length > 0) {
            this.isChasing = true;
            playSound('clownSeesYou');
            this.moveCharacterAlongPath();
          }
        }
      }
    } else {
      // Not in same room, stop chasing
      this.isChasing = false;
      this.targetGirlfriend = null;
    }
  }

  draw(CELL_SIZE) {
    if (this.characterPos) {
      const newSize = CELL_SIZE * 3; // Increased from 2x to 3x for 50% bigger
      const offset = (newSize - CELL_SIZE) / 2;
      push();
      if (this.previousPos && this.characterPos.x > this.previousPos.x) {
        scale(-1, 1);
        image(
          this.img,
          -this.characterPos.x * CELL_SIZE - newSize + offset,
          this.characterPos.y * CELL_SIZE - offset,
          newSize,
          newSize
        );
      } else {
        image(
          this.img,
          this.characterPos.x * CELL_SIZE - offset,
          this.characterPos.y * CELL_SIZE - offset,
          newSize,
          newSize
        );
      }
      pop();
    }
  }

  moveCharacterAlongPath() {
    if (this.path && this.path.length > 0) {
      this.isMoving = true;
      const nextPos = this.path.shift();
      this.previousPos = { ...this.characterPos };
      this.characterPos = nextPos;

      // Use the current speed for movement delay
      setTimeout(() => {
        this.isMoving = false;
        if (this.path.length > 0) {
          this.moveCharacterAlongPath();
        }
      }, this.baseSpeed);
    }
  }

  startSpeedIncrease() {
    // Increase speed every 30 seconds
    setInterval(() => {
      if (this.baseSpeed > this.minSpeed) {
        this.baseSpeed = Math.max(
          this.baseSpeed - this.speedIncreaseAmount,
          this.minSpeed
        );
        console.log(
          `Clown speed increased! Current delay: ${this.baseSpeed}ms`
        );
      }
    }, this.speedIncreaseInterval);
  }
}
