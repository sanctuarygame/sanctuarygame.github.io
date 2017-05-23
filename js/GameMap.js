class GameMap {
  constructor(resolution, grid) {
    this.resolution = resolution;
    this.grid = (typeof grid == "undefined") ? GameMap.getEmptyGrid(resolution) : grid;
  }

  getGrid() {
    return this.grid;
  }

  getGridHeight() {
    return 320 / this.resolution;
  }

  getGridWidth() {
    return 640 / this.resolution;
  }

  setGrid(grid) {
    this.grid = grid;
  }

  setTile(x, y, canPass) {
    this.grid[x][y] = (canPass) ? 0 : 1;
  }

  getResolution() {
    return this.resolution;
  }

  setResolution(resolution) {
    this.resolution = resolution;
  }

  getTile(x, y) {
    return this.grid[x][y];
  }

  static getEmptyGrid(resolution) {
    var height = 320 / resolution;
    var width = 640 / resolution;
    var grid = new Array();
    for(var i = 0; i < height; i++) {
      grid[i] = new Array(width);
      grid[i].fill(0);
    }
    return grid;
  }
}
