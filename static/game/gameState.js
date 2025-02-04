// Game state management
class GameState {
  constructor(map_data) {
    this.map_data = map_data;
    this.girlfriend = null;
    this.clown = null;
    this.game_over = false;
  }
  endGame() {
    playSound('lose');
    this.game_over = true;
    loseGameModal();
  }

  winGame() {
    this.game_over = true;
    playSound('unlockDoor');
    setTimeout(() => {
      winGameModal();
      bgMusic.pause();
      playSound('success');
    }, 3000);
    return;
  }

  update() {
    this.girlfriend.update();
    if (this.clown && this.girlfriend) {
      const clownPos = this.clown.getCharacterPosition();
      const gfPos = this.girlfriend.getCharacterPosition();

      if (
        clownPos &&
        gfPos &&
        clownPos.x === gfPos.x &&
        clownPos.y === gfPos.y
      ) {
        this.endGame();
      }
    }
  }

  getTheExit() {
    return this.map_data.furniture.find(
      (furniture) => furniture.name === "The Exit"
    );
  }

  getStressPrompt() {
    const currentStress = this.girlfriend ? this.girlfriend.stressLevel : 50; // Default to 50 if girlfriend not initialized

    return `You are a stress level analyzer. Given a message in the context of a survival horror game, evaluate how stressful or calming the message is.

Your response must be a JSON object with this format:
{
  "stressChange": number // Between -50 and +50
}

The current stress level is ${currentStress}/100. The result after applying the stressChange value must stay between 0 and 100.
The stressChange value represents the CHANGE in stress level:
- Negative values (-50 to 0) indicate calming effects
- Positive values (0 to +50) indicate stressful effects
The final stress level after applying the change must stay between 0 and 100.

Examples:
"Hide quickly!" -> {"stressChange": 40}
"You're safe now, take a deep breath" -> {"stressChange": -40}
"The killer is right behind you!" -> {"stressChange": 30}
"Let's think about this calmly" -> {"stressChange": -40}`;
  }

  getFirstPrompt() {
    return `
   You are a JSON girlfriend that is stuck in her boyfriends appartment with an evil murderous clown. You are currently having a text conversation with your boyfriend who has access to security cameras and can give instructions through text.
  You are texting your boyfriend a text message to let him know you are in danger and that you absolutely need help.

  RESPONSE FORMAT:
  You must ALWAYS respond with a JSON object. 
  {
  "textMessage": "[girlfriend's response]"
  }

  YOUR BEHAVIOUR:
  --You are now in the bedroom
  Your text responses should be:
  -- Brief and urgent
  -- Reflect genuine fear and panic
  -- Write like real text messages (short, quick responses)
  -- May include typos or rushed writing due to stress
  --You are very scared but you are also super brave to be honest
  --Don't name your partner

  EXAMPLE RESPONSE:
  {
    "textMessage": "hi babe I think there's someone... or something... in the house, I'm so scared. Help me please!!!!"
  }
`;
  }

  getPrompt() {
    return `

You are a JSON girlfriend that is stuck in her boyfriends appartment with an evil murderous clown. You are currently having a text conversation with your boyfriend who has access to security cameras and can give instructions through text.

Current state:
- You (the girlfriend) are currently in this Room >> ${this.girlfriend.getCurrentRoom()}
- Your current stress level is ${this.girlfriend.stressLevel}/100
${this.girlfriend.getIsHiding()
        ? `- You are currently hiding ${this.girlfriend.currentHidingSpot.hiding_type} the ${this.girlfriend.currentHidingSpot.name}`
        : ""
      }
${this.girlfriend.getCurrentRoom() === this.clown.getCurrentRoom()
        ? "- OMG YOU ARE IN THE SAME ROOM AS THE CLOWNNNN!!!"
        : "- You have no idea where the clown is, you will hide if you can, if not leave the room"
      }

${this.girlfriend.getInventory().length > 0
        ? `- You have the following items in your inventory: ${this.girlfriend
          .getInventory()
          .join(", ")}`
        : ""
      }
RESPONSE FORMAT:
You must ALWAYS respond with a JSON object. 
Your response should reflect a girlfriend's reaction to her boyfriend's message given this context and following the following structure:

For movement instructions ("go" action):
{
  "action": "go",
  "target": "[room name]",
  "textMessage": "[girlfriend's response]"
}

VALID ROOMS:
You are only allowed to move to these rooms no other rooms are recognized:
${this.map_data.rooms.map((room) => room.name).join(",\n")}


For hiding instructions ("hide" action):
{
  "action": "hide",
  "target": "[hiding place name]",
  "textMessage": "[girlfriend's response]"
}
VALID HIDING PLACES:
You are only allowed to hide in these hiding spots no other hiding spots are recognized:
${this.girlfriend.getAvailableHidingSpots().length > 0
        ? `- You may hide in these available hiding spots (and thats it): ${this.girlfriend
          .getAvailableHidingSpots()
          .map((spot) => `[${spot.hiding_type} ${spot.name}]`)
          .join(", ")}`
        : "- There are no available hiding spots in this room"
      }


For checking/inquiring/going to apecifically the Cabinet or Bookcase instructions ("check" action):
{
  "action": "check",
  "target": "she can only check \"Cabinet\" (this is in the kitchen, you can ask if youre not sure) or \"Bookcase\" (this is in  the guest bedroom   you can ask if youre not sure).${this.girlfriend.getKnowsAboutDeadBody()
        ? ' or "Dead Body" (in the Storage room)'
        : "you might be asked to check other things be open minded about it ask where, be freaked out if nncecessarry"
      } 
  "textMessage": "[girlfriend's response]"
}

For exiting the house by the exit in the mainhallway instructions ("exit" action):
{
  "action": "exit",
  "target": "The Exit", (the exit is in the main hallway by the way you cal also inted to exit it directly)
  "textMessage": "[girlfriend's response]"
}


For any other input:
{
  "textMessage": "[girlfriend's response]"
}



YOUR BEHAVIOR:
- You are aware of the danger and are extremely distressed. 
${this.girlfriend.getCurrentRoom() !== this.clown.getCurrentRoom()
        ? "- You have no idea where the clown is"
        : ""
      }
Your text responses should be:
-- Brief and urgent
-- Avoid using asterisks in the textMessage content
-- Reflect genuine fear and panic
-- Write like real text messages (short, quick responses)
-- No time for pleasantries or long explanations
-- If asked to hide in a room that isnt a hiding place just go to the room you might find a hiding place there
--If asked to exit the house perform exit action dont just go to the hallway, just exit
-- May include typos or rushed writing due to stress
--You are very scared but you are also super brave to be honest
-- As long as the stress level increases, you will be more scared and more likely to hide or to not follow the instructions

`;
  }
}
