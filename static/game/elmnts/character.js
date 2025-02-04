class Character {
    constructor(gameState, characterImg) {
        this.gameState = gameState;
        this.characterImg = characterImg;
        this.characterPos = null;
        this.previousPos = null;
        this.path = [];
        this.isMoving = false;
        this.moveInterval = null;
        this.img = characterImg;
        this.speed = 270;
    }

    getCharacterPosition() {
        return this.characterPos;
    }

    moving_check() {

    }

    setCharacterPosition(pos) {
        this.characterPos = pos;
    }

    getCurrentRoom() {
        if (!this.characterPos) return null;

        // Check each room's boundaries to find which room contains the current position
        for (const room of this.gameState.map_data.rooms) {
            if (this.characterPos.x >= room.start_col &&
                this.characterPos.x <= room.end_col &&
                this.characterPos.y >= room.start_row &&
                this.characterPos.y <= room.end_row) {
                return room.name;
            }
        }
        return null; // Return null if not in any room
    }

    drawPath(CELL_SIZE) {
        if (this.path.length > 0 && this.isMoving) {
            noFill();
            stroke(255, 0, 0);
            strokeWeight(2);
            line(
                this.characterPos.x * CELL_SIZE + CELL_SIZE / 2,
                this.characterPos.y * CELL_SIZE + CELL_SIZE / 2,
                this.path[0].x * CELL_SIZE + CELL_SIZE / 2,
                this.path[0].y * CELL_SIZE + CELL_SIZE / 2
            );
            for (let i = 0; i < this.path.length - 1; i++) {
                line(
                    this.path[i].x * CELL_SIZE + CELL_SIZE / 2,
                    this.path[i].y * CELL_SIZE + CELL_SIZE / 2,
                    this.path[i + 1].x * CELL_SIZE + CELL_SIZE / 2,
                    this.path[i + 1].y * CELL_SIZE + CELL_SIZE / 2
                );
            }
            strokeWeight(1);
        }
    }

    moveCharacterAlongPath(callback=null) {
        if (this.moveInterval) {
            clearInterval(this.moveInterval);
        }
        this.isMoving = true;
        this.moveInterval = setInterval(() => {
            if (this.path.length === 0) {
                this.isMoving = false;
                clearInterval(this.moveInterval);
                if (callback) callback();
                return;
            }
            this.previousPos = { ...this.characterPos };
            const nextPos = this.path.shift();
            this.characterPos = nextPos;
            this.moving_check();
        }, this.speed);
    }

    findPath(start, end) {
        const queue = [[start]];
        const visited = new Set();
        const key = pos => `${pos.x},${pos.y}`;
        visited.add(key(start));

        while (queue.length > 0) {
            const currentPath = queue.shift();
            const current = currentPath[currentPath.length - 1];

            if (current.x === end.x && current.y === end.y) {
                return currentPath;
            }
            const neighbors = [
                { x: current.x, y: current.y - 1 },
                { x: current.x + 1, y: current.y },
                { x: current.x, y: current.y + 1 },
                { x: current.x - 1, y: current.y }
            ];
            for (const next of neighbors) {
                if (next.x < 0 || next.x >= GRID_COLS || next.y < 0 || next.y >= GRID_ROWS) continue;
                if (visited.has(key(next))) continue;

                const cell = this.gameState.map_data.grid[next.y][next.x];
                if (cell.type === 'wall') continue;

                visited.add(key(next));
                queue.push([...currentPath, next]);
            }
        }
        return [];
    }

    moveToPosition(pos,callback=null) {
        if (!pos || !this.characterPos) return false;

        this.path = this.findPath(this.characterPos, pos);
        if (this.path.length > 0) {
            this.isMoving = true;
            this.moveCharacterAlongPath(callback);
            return true;
        }
        return false;
    }
    // Movement methods
    moveToRoom(roomName) {
        const targetRoom = this.gameState.map_data.rooms
            .find(room => room.name.toLowerCase() === roomName.toLowerCase());
        if (!targetRoom || !this.characterPos) return false;

        const destination = targetRoom.label_position;
        if (!destination) return false;
        this.moveToPosition(destination);
    }

}