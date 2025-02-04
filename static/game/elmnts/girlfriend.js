class Girlfriend extends Character {
    constructor(gameState, girlfriendImg) {
        super(gameState, girlfriendImg);
        this.gameState = gameState;
        this.gameState.girlfriend = this;
        this.img = girlfriendImg;
        this.setCharacterPosition(this.gameState.map_data.girlfriend_start_pos);
        this.currentHidingSpot = null;
        this.stressLevel = 30;
        this.inventory = [];
        this.knows_about_dead_body = false;
        this.independance_rate = 2000;
        this.game_loops_before_deciding_for_herself = 700;
    }

    update(){
        this.game_loops_before_deciding_for_herself--;
        if(this.game_loops_before_deciding_for_herself <= 0){
            this.game_loops_before_deciding_for_herself = this.independance_rate;
            strongIndependantWoman();
        }
    }

    draw(CELL_SIZE) {
        if (this.characterPos) {
            push();
            if (this.previousPos && this.characterPos.x > this.previousPos.x) {
                scale(-1, 1);
                image(
                    this.img,
                    -this.characterPos.x * CELL_SIZE - CELL_SIZE * 2,
                    this.characterPos.y * CELL_SIZE,
                    CELL_SIZE * 2,
                    CELL_SIZE * 2
                );
            } else {
                if (this.getIsHiding()) {
                    tint(255, 153);
                    image(
                        this.img,
                        this.characterPos.x * CELL_SIZE,
                        this.characterPos.y * CELL_SIZE,
                        CELL_SIZE * 2,
                        CELL_SIZE * 2
                    );
                } else {
                    image(
                        this.img,
                        this.characterPos.x * CELL_SIZE,
                        this.characterPos.y * CELL_SIZE,
                        CELL_SIZE * 2,
                        CELL_SIZE * 2
                    );
                }
            }
            pop();
        }
    }

    updateStressLevel(stressChange) {

        if (this.stressLevel <= 60) {
            setStressLevel('no');
        } else if (this.stressLevel > 40 && this.stressLevel <= 70) {
            setStressLevel('low'); 
        } else if (this.stressLevel > 70) {
            setStressLevel('very');
        }


        // Add or subtract the stress change while keeping within 0-100 range
        this.stressLevel = Math.max(
            0,
            Math.min(100, this.stressLevel + stressChange)
        );
    }

    handleAction(response, called_by_chat = false) {
        if(called_by_chat){
            this.game_loops_before_deciding_for_herself = this.independance_rate;
        }
        switch (response.action) {
            case "go":
                playSound('gfMove');
                this.moveToRoom(response.target);
                break;
            case "hide":
                this.hide(response.target);
                break;
            case "exit":
                this.exit();
                break;
            case "check":
                this.check(response.target)
                break;
        }
    }

    getAvailableHidingSpots() {
        // Find the current room in map data
        const currentRoom = this.gameState.map_data.rooms.find(
            (room) => room.name === this.getCurrentRoom()
        );
        // Return hiding places for current room if found, otherwise empty array
        return currentRoom ? currentRoom.hiding_places : [];
    }

    getAvailableFurniture() {
        // Get current room
        const currentRoom = this.getCurrentRoom();
        if (!currentRoom) return [];

        // Filter furniture list to only include items in current room that are in use
        return this.gameState.map_data.furniture.filter(
            furniture => furniture.room === currentRoom && furniture.in_use === true
        );
    }

    getKnowsAboutDeadBody() {
        return this.knows_about_dead_body;
    }

    getInventory() {
        return this.inventory;
    }

    getIsHiding() {
        const hidingSpots = this.getAvailableHidingSpots();
        if (!this.characterPos || hidingSpots.length === 0) return false;

        return hidingSpots.some(
            (spot) =>
                spot.position.x === this.characterPos.x &&
                spot.position.y === this.characterPos.y
        );
    }

    hide(hidingSpotName) {
        const currentRoom = this.getCurrentRoom();
        if (!currentRoom) return;

        // Find the room data from map_data
        const roomData = this.gameState.map_data.rooms.find(
            (room) => room.name === currentRoom
        );
        if (!roomData) return;

        // Find the specific hiding spot in the room by checking if names contain each other
        const hidingSpot = roomData.hiding_places.find(
            (spot) =>
                spot.name
                    .toLowerCase()
                    .trim()
                    .includes(hidingSpotName.toLowerCase().trim()) ||
                hidingSpotName
                    .toLowerCase()
                    .trim()
                    .includes(spot.name.toLowerCase().trim())
        );

        if (!hidingSpot) return;

        // Move to the hiding spot position
        this.moveToPosition(hidingSpot.position, () => {
            this.currentHidingSpot = hidingSpotName;
        });
    }

    exit() {
        let the_exit = this.gameState.getTheExit();
        let x = the_exit.pos.x;
        let y = the_exit.pos.y - 1;
        let pos = { "x": x, "y": y };
        this.moveToPosition(pos, () => {
            if (!this.inventory || !this.inventory.includes("Key")) {
                addProgramaticMessage(the_exit.locked_message);
            } else {
                this.gameState.winGame();
                addProgramaticMessage(the_exit.unlocked_message);
            }
        });
    }

    check(target) {
        if (target === "Bookcase") {
            let bookcase = this.gameState.map_data.furniture.find(item => item.name === "Bookcase");
            this.moveToPosition(bookcase.pos, () => {
                addProgramaticMessage(bookcase.msg);
                bookcase.state = "unusable";
            });
        } else if (target === "Cabinet") {
            let cabinet =this.gameState.map_data.furniture.find(item => item.name === "Cabinet");
            this.moveToPosition(cabinet.pos, () => {
                addProgramaticMessage(cabinet.msg);
                this.inventory.push("Knife");
                cabinet.state = "unsearchable";
            });
        } else if (target === "Dead Body") {
            let deadBody = this.gameState.map_data.furniture.find(item => item.name === "Dead Body");
            this.moveToPosition(deadBody.pos, () => {

                if (this.inventory.includes("Knife")) {
                    playSound('useKnife');
                    addProgramaticMessage("No no no ew ew i can't believe im doing this...😭😭😭 ....the key was in here i got it!! I can get out!");
                    deadBody.state = "unusable";
                    this.inventory.push("Key");
                } else {
                    addProgramaticMessage("Um... what. the. f. Why is its mouth stitched up? Is the key inside??? i cant open it");
                }

            });


        }

    }

    moving_check() {
        if (this.getCurrentRoom() === "Storage") {
            this.knows_about_dead_body = true;
        }
    }
}
