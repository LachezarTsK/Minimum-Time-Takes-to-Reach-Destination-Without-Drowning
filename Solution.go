
package main

import (
	"container/list"
	"fmt"
	"math"
)

var moves [4][2]int = [4][2]int{{-1, 0}, {1, 0}, {0, -1}, {0, 1}}
var START string = "S"
var DESTINATION string = "D"
var EMPTY string = "."
var STONE string = "X"
var FLOODED string = "*"
var IMPOSSIBLE_TO_REACH_DESTINATION int = -1
var NOT_FLOODED int = math.MaxInt
var VISITED int = 0

var rows int
var columns int
var landPointer (*[][]string)
var minTimeToFlood [][]int

type Point struct {
	row    int
	column int
}

func minimumSeconds(land [][]string) int {
	rows = len(land)
	columns = len(land[0])
	landPointer = &land
	initializeMatrixMinTimeToFlood()
	return findMinTimeToReachDestination()
}

func findMinTimeToReachDestination() int {
	var queueForDestinationTime = list.New()
	initializeQueueForDestinationTime(queueForDestinationTime)
	var minTimeToDestination = 0

	for queueForDestinationTime.Len() > 0 {

		for i := queueForDestinationTime.Len() - 1; i >= 0; i-- {
			var current = queueForDestinationTime.Front().Value
			queueForDestinationTime.Remove(queueForDestinationTime.Front())

			if (*landPointer)[current.(Point).row][current.(Point).column] == DESTINATION {
				return minTimeToDestination
			}

			for _, move := range moves {
				var nextRow = current.(Point).row + move[0]
				var nextColumn = current.(Point).column + move[1]
				if isValidPointToStep(nextRow, nextColumn, minTimeToDestination+1) {
					queueForDestinationTime.PushBack(Point{nextRow, nextColumn})
					minTimeToFlood[nextRow][nextColumn] = VISITED
				}
			}
		}

		minTimeToDestination++
	}

	return IMPOSSIBLE_TO_REACH_DESTINATION
}

func initializeMatrixMinTimeToFlood() {
	minTimeToFlood = make([][]int, rows)

	for r := 0; r < rows; r++ {
		minTimeToFlood[r] = make([]int, columns)
		for c := 0; c < columns; c++ {
			minTimeToFlood[r][c] = NOT_FLOODED
		}
	}

	var floodTime = 0
	var queueForFloodTime = list.New()
	initializeQueueForFloodTime(queueForFloodTime, floodTime)

	for queueForFloodTime.Len() > 0 {
		floodTime++
		for i := queueForFloodTime.Len() - 1; i >= 0; i-- {
			var current = queueForFloodTime.Front().Value
			queueForFloodTime.Remove(queueForFloodTime.Front())

			for _, move := range moves {
				var nextRow = current.(Point).row + move[0]
				var nextColumn = current.(Point).column + move[1]
				if isValidPointToFlood(nextRow, nextColumn) {
					minTimeToFlood[nextRow][nextColumn] = floodTime
					queueForFloodTime.PushBack(Point{nextRow, nextColumn})
				}
			}
		}
	}
}

func initializeQueueForFloodTime(queueForFloodTime *list.List, floodTime int) {
	for r := 0; r < rows; r++ {
		for c := 0; c < columns; c++ {
			if (*landPointer)[r][c] == FLOODED {
				queueForFloodTime.PushBack(Point{r, c})
				minTimeToFlood[r][c] = floodTime
			}
		}
	}
}

func initializeQueueForDestinationTime(queueForDestinationTime *list.List) {
	for r := 0; r < rows; r++ {
		for c := 0; c < columns; c++ {
			if (*landPointer)[r][c] == START {
				queueForDestinationTime.PushBack(Point{r, c})
				return
			}
		}
	}
}

func isValidPointToFlood(row int, column int) bool {
	return isInBoundary(row, column) &&
		minTimeToFlood[row][column] == NOT_FLOODED &&
		((*landPointer)[row][column] == EMPTY ||
			(*landPointer)[row][column] == START)
}

func isValidPointToStep(row int, column int, currentTime int) bool {
	return isInBoundary(row, column) &&
		((minTimeToFlood[row][column] > currentTime &&
			(*landPointer)[row][column] == EMPTY) ||
			(*landPointer)[row][column] == DESTINATION)
}

func isInBoundary(row int, column int) bool {
	return row >= 0 && row < rows && column >= 0 && column < columns
}
