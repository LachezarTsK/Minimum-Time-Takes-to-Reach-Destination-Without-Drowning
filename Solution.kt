
import java.util.Queue
import java.util.Arrays
import java.util.LinkedList


class Solution {

    private data class Point(val row: Int, val column: Int) {}

    private companion object {
        val moves = arrayOf<IntArray>(intArrayOf(-1, 0), intArrayOf(1, 0), intArrayOf(0, -1), intArrayOf(0, 1))
        const val START = "S"
        const val DESTINATION = "D"
        const val EMPTY = "."
        const val STONE = "X"
        const val FLOODED = "*"
        const val IMPOSSIBLE_TO_REACH_DESTINATION = -1
        const val NOT_FLOODED = Integer.MAX_VALUE
        const val VISITED = 0
    }

    private var rows = 0
    private var columns = 0
    private var land: List<List<String>> = ArrayList<List<String>>()
    private var minTimeToFlood: ArrayList<IntArray> = ArrayList<IntArray>()

    fun minimumSeconds(land: List<List<String>>): Int {
        rows = land.size
        columns = land[0].size
        this.land = land
        initializeMatrixMinTimeToFlood()
        return findMinTimeToReachDestination()
    }

    private fun findMinTimeToReachDestination(): Int {
        val queueForDestinationTime = LinkedList<Point>()
        initializeQueueForDestinationTime(queueForDestinationTime)
        var minTimeToDestination = 0

        while (!queueForDestinationTime.isEmpty()) {

            for (i in queueForDestinationTime.size - 1 downTo 0) {
                val current = queueForDestinationTime.poll()
                if (land[current.row][current.column] == DESTINATION) {
                    return minTimeToDestination
                }

                for (move in moves) {
                    val nextRow = current.row + move[0]
                    val nextColumn = current.column + move[1]
                    if (isValidPointToStep(nextRow, nextColumn, minTimeToDestination + 1)) {
                        queueForDestinationTime.add(Point(nextRow, nextColumn))
                        minTimeToFlood[nextRow][nextColumn] = VISITED
                    }
                }
            }

            ++minTimeToDestination
        }

        return IMPOSSIBLE_TO_REACH_DESTINATION
    }

    private fun initializeMatrixMinTimeToFlood() {
        minTimeToFlood = ArrayList<IntArray>(rows)

        for (r in 0..<rows) {
            minTimeToFlood.add(IntArray(columns))
            Arrays.fill(minTimeToFlood[r], NOT_FLOODED)
        }

        var floodTime = 0
        val queueForFloodTime = LinkedList<Point>()
        initializeQueueForFloodTime(queueForFloodTime, floodTime)

        while (!queueForFloodTime.isEmpty()) {
            ++floodTime
            for (i in queueForFloodTime.size - 1 downTo 0) {
                val current = queueForFloodTime.poll()

                for (move in moves) {
                    val nextRow = current.row + move[0]
                    val nextColumn = current.column + move[1]
                    if (isValidPointToFlood(nextRow, nextColumn)) {
                        minTimeToFlood[nextRow][nextColumn] = floodTime
                        queueForFloodTime.add(Point(nextRow, nextColumn))
                    }
                }
            }
        }
    }

    private fun initializeQueueForFloodTime(queueForFloodTime: Queue<Point>, floodTime: Int) {
        for (r in 0..<rows) {
            for (c in 0..<columns) {
                if (land[r][c] == FLOODED) {
                    queueForFloodTime.add(Point(r, c))
                    minTimeToFlood[r][c] = floodTime
                }
            }
        }
    }

    private fun initializeQueueForDestinationTime(queueForDestinationTime: Queue<Point>) {
        for (r in 0..<rows) {
            for (c in 0..<columns) {
                if (land[r][c] == START) {
                    queueForDestinationTime.add(Point(r, c))
                    return
                }
            }
        }
    }

    private fun isValidPointToFlood(row: Int, column: Int): Boolean {
        return isInBoundary(row, column)
                && minTimeToFlood[row][column] == NOT_FLOODED
                && (land[row][column] == EMPTY
                || land[row][column] == START)
    }

    private fun isValidPointToStep(row: Int, column: Int, currentTime: Int): Boolean {
        return isInBoundary(row, column)
                && ((minTimeToFlood[row][column] > currentTime
                && land[row][column] == EMPTY)
                || land[row][column] == DESTINATION)
    }

    private fun isInBoundary(row: Int, column: Int): Boolean {
        return row in 0..<rows && column in 0..<columns
    }
}
