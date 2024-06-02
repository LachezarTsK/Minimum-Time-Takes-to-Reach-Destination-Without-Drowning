
/**
 * @param {string[][]} land
 * @return {number}
 */
var minimumSeconds = function (land) {
    this.moves = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    this.START = "S";
    this.DESTINATION = "D";
    this.EMPTY = ".";
    this.STONE = "X";
    this.FLOODED = "*";
    this.IMPOSSIBLE_TO_REACH_DESTINATION = -1;
    this.NOT_FLOODED = Number.MAX_SAFE_INTEGER;
    this.VISITED = 0;

    this.rows = land.length;
    this.columns = land[0].length;
    this.land = land;
    this.minTimeToFlood = [];

    initializeMatrixMinTimeToFlood();
    return findMinTimeToReachDestination();

};

/**
 * @param {number} row
 * @param {number}column
 */
function Point(row, column) {
    this.row = row;
    this.column = column;
}

/**
 * @return {void} 
 */
function findMinTimeToReachDestination() {
    // Queue<Point>    
    // const {Queue} = require('@datastructures-js/queue');
    const queueForDestinationTime = new Queue();
    initializeQueueForDestinationTime(queueForDestinationTime);
    let minTimeToDestination = 0;

    while (!queueForDestinationTime.isEmpty()) {

        for (let i = queueForDestinationTime.size() - 1; i >= 0; --i) {
            const current = queueForDestinationTime.dequeue();
            if (this.land[current.row][current.column] === this.DESTINATION) {
                return minTimeToDestination;
            }

            for (let move of this.moves) {
                let nextRow = current.row + move[0];
                let nextColumn = current.column + move[1];
                if (isValidPointToStep(nextRow, nextColumn, minTimeToDestination + 1)) {
                    queueForDestinationTime.enqueue(new Point(nextRow, nextColumn));
                    this.minTimeToFlood[nextRow][nextColumn] = this.VISITED;
                }
            }
        }

        ++minTimeToDestination;
    }

    return this.IMPOSSIBLE_TO_REACH_DESTINATION;
}

/**
 * @return {void} 
 */
function initializeMatrixMinTimeToFlood() {
    this.minTimeToFlood = Array.from(new Array(this.rows), () => new Array(this.columns).fill(this.NOT_FLOODED));

    let floodTime = 0;
    // Queue<Point>
    // const {Queue} = require('@datastructures-js/queue');
    const queueForFloodTime = new Queue();
    initializeQueueForFloodTime(queueForFloodTime, floodTime);

    while (!queueForFloodTime.isEmpty()) {
        ++floodTime;
        for (let i = queueForFloodTime.size() - 1; i >= 0; --i) {
            const current = queueForFloodTime.dequeue();

            for (let move of this.moves) {
                let nextRow = current.row + move[0];
                let nextColumn = current.column + move[1];
                if (isValidPointToFlood(nextRow, nextColumn)) {
                    this.minTimeToFlood[nextRow][nextColumn] = floodTime;
                    queueForFloodTime.enqueue(new Point(nextRow, nextColumn));
                }
            }
        }
    }
}

/**
 * @param {Queue<Point>} queueForFloodTime
 * @param {number} floodTime 
 * @return {void} 
 */
function initializeQueueForFloodTime(queueForFloodTime, floodTime) {
    for (let r = 0; r < this.rows; ++r) {
        for (let c = 0; c < this.columns; ++c) {
            if (this.land[r][c] === this.FLOODED) {
                queueForFloodTime.enqueue(new Point(r, c));
                this.minTimeToFlood[r][c] = floodTime;
            }
        }
    }
}

/**
 * @param {Queue<Point>} queueForDestinationTime
 * @return {void} 
 */
function initializeQueueForDestinationTime(queueForDestinationTime) {
    for (let r = 0; r < this.rows; ++r) {
        for (let c = 0; c < this.columns; ++c) {
            if (this.land[r][c] === this.START) {
                queueForDestinationTime.enqueue(new Point(r, c));
                return;
            }
        }
    }
}

/**
 * @param {number} row
 * @param {number}column
 * @return {boolean} 
 */
function isValidPointToFlood(row, column) {
    return isInBoundary(row, column)
            && this.minTimeToFlood[row][column] === this.NOT_FLOODED
            && (this.land[row][column] === this.EMPTY
            || this.land[row][column] === this.START);
}

/**
 * @param {number} row
 * @param {number}column
 * @param {number} currentTime 
 * @return {boolean} 
 */
function isValidPointToStep(row, column, currentTime) {
    return isInBoundary(row, column)
            && ((this.minTimeToFlood[row][column] > currentTime
            && this.land[row][column] === this.EMPTY)
            || this.land[row][column] === this.DESTINATION);
}

/**
 * @param {number} row
 * @param {number}column
 * @return {boolean} 
 */
function isInBoundary(row, column) {
    return row >= 0 && row < this.rows && column >= 0 && column < this.columns;
}
