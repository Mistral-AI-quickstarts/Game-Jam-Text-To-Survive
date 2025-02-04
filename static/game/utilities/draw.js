function drawGrid() {
    stroke(200);
    for (let x = 0; x <= GRID_COLS; x++) {
        line(x * CELL_SIZE, 0, x * CELL_SIZE, GRID_ROWS * CELL_SIZE);
    }
    for (let y = 0; y <= GRID_ROWS; y++) {
        line(0, y * CELL_SIZE, GRID_COLS * CELL_SIZE, y * CELL_SIZE);
    }
}

function stringToHue(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash % 360;
}

function drawLabels(rooms) {
    for (let room of rooms) {
        const hue = stringToHue(room.name);
        fill(hue, 30, 95, 0.3);
        noStroke();
        
        // Draw room highlight rectangle
        const width = (room.end_col - room.start_col + 1) * CELL_SIZE;
        const height = (room.end_row - room.start_row + 1) * CELL_SIZE;
        rect(room.start_col * CELL_SIZE, room.start_row * CELL_SIZE, width, height);

        // Draw room label
        textAlign(CENTER, CENTER);
        textSize(14);

        fill(0);
        text(
            room.name,
            room.label_position.x * CELL_SIZE + CELL_SIZE / 2,
            room.label_position.y * CELL_SIZE + CELL_SIZE / 2
        );

        // Draw hiding places for this room
        for (let hidingSpot of room.hiding_places) {
            // Draw the hiding place cells
            fill(100, 30, 95, 0.3);
            noStroke();
            const cell = hidingSpot.position;
            rect(cell.x * CELL_SIZE, cell.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);

            const x = cell.x * CELL_SIZE + CELL_SIZE / 2;
            const y = cell.y * CELL_SIZE + CELL_SIZE / 2;

            push();
            textAlign(CENTER, CENTER);
            textSize(12);

            // Measure exactly the text size (no extra padding)
            const labelWidth = textWidth(hidingSpot.name);
            const labelHeight = textAscent();

            // Draw a centered background rectangle 
            // that's just as wide/tall as the text
            rectMode(CENTER);
            fill('#f1c94f');
            noStroke();
            rect(x, y, labelWidth, labelHeight / 2, 2);
            pop();

            // Draw the text on top
            fill(0);
            textAlign(CENTER, CENTER);
            textSize(12);
            text(hidingSpot.name, x, y);
        }
    }
}

function drawWallsAndDoors() {
    let grid = gameState.map_data.grid;
    for (let y = 0; y < GRID_ROWS; y++) {
        for (let x = 0; x < GRID_COLS; x++) {
            const cell = grid[y][x];
            if (cell.type === 'wall') {
                fill(0);
                noStroke();
                rect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
            } else if (cell.type === 'door') {
                fill(139, 69, 19); // Brown color for doors
                noStroke();
                rect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
            } else if (cell.color) {
                noStroke();
                switch (cell.color) {
                    case 'yellow':
                        fill('#ffeb3b');
                        break;
                    case 'blue':
                        fill('#2196f3');
                        break;
                    case 'green':
                        fill('#4caf50');
                        break;
                    case 'red':
                        fill('#f44336');
                        break;
                }
                rect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
            }
        }
    }
}

function loadFurnitureSprites(furniture) {
    const sprites = [];
    for (let i = 0; i < furniture.length; i++) {
        for (let j = 0; j < furniture[i].sprite.length; j++) {
            if (!sprites.includes(furniture[i].sprite[j].img)) {
                sprites[furniture[i].sprite[j].img] = loadImage(furniture[i].sprite[j].img);
            }
        }
    }
    return sprites;
}

function drawFurniture(furniture, sprites) {
    // Draw all sprites first
    for (let item of furniture) {
        const sprite = item.sprite.find(s => s.for === item.state);
        if (sprite && sprites[sprite.img]) {
            image(sprites[sprite.img], 0, 0, GRID_COLS * CELL_SIZE, GRID_ROWS * CELL_SIZE);
        }
    }
    
    // Draw all labels second
    for (let item of furniture) {
        if (item.pos && item.in_use == true) {
            push();
            // Draw light gray background
            fill(220);
            noStroke();
            const padding = 4;
            const textWidth = textSize() * item.name.length * 0.6;
            rectMode(CENTER);
            rect((item.pos.x + 0.5) * CELL_SIZE, (item.pos.y + 0.5) * CELL_SIZE, textWidth, 20);
            
            // Draw black text
            fill(0);
            textAlign(CENTER, CENTER);
            textSize(12);
            text(item.name, (item.pos.x + 0.5) * CELL_SIZE, (item.pos.y + 0.5) * CELL_SIZE);
            pop();
        }
    }
}

