function adjustScale() {
    const availableWidth = window.innerWidth - 400 - 40; // space for chat + margins
    const actualCanvasWidth = GRID_COLS * CELL_SIZE;
    const scale = availableWidth / actualCanvasWidth;
    const mapWrapper = document.querySelector('#mapSection .map-wrapper');
    if (mapWrapper) {
        mapWrapper.style.zoom = scale;
    }
}

window.addEventListener('resize', adjustScale);
