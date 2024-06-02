
#include <array>
#include <queue>
#include <string>
#include <vector>
#include <memory>
#include <limits>
using namespace std;

class Solution {

    struct Point {
        size_t row;
        size_t column;
        Point() = default;
        Point(size_t row, size_t column) :row{ row }, column{ column } {};
    };

    static constexpr array<array<int, 2>, 4> moves{ { {-1, 0}, {1, 0}, {0, -1}, {0, 1} } };
    inline static const string START = "S";
    inline static const string DESTINATION = "D";
    inline static const string EMPTY = ".";
    inline static const string STONE = "X";
    inline static const string FLOODED = "*";
    inline static const int IMPOSSIBLE_TO_REACH_DESTINATION = -1;
    inline static const int NOT_FLOODED = numeric_limits<int>::max();
    inline static const int VISITED = 0;

    size_t rows;
    size_t columns;
    unique_ptr<vector<vector<string>>> land;
    vector<vector<int>> minTimeToFlood;

public:
    int minimumSeconds(const vector<vector<string>>& land) {
        this->rows = land.size();
        this->columns = land[0].size();
        this->land = make_unique< vector<vector<string>>>(land);
        initializeMatrixMinTimeToFlood();
        return findMinTimeToReachDestination();
    }

private:
    int findMinTimeToReachDestination() {
        queue<Point> queueForDestinationTime;
        initializeQueueForDestinationTime(queueForDestinationTime);
        int minTimeToDestination = 0;

        while (!queueForDestinationTime.empty()) {

            for (size_t i = queueForDestinationTime.size() - 1; i != variant_npos; --i) {
                Point current = queueForDestinationTime.front();
                queueForDestinationTime.pop();

                if ((*land)[current.row][current.column] == DESTINATION) {
                    return minTimeToDestination;
                }

                for (const auto& move : moves) {
                    size_t nextRow = current.row + move[0];
                    size_t nextColumn = current.column + move[1];
                    if (isValidPointToStep(nextRow, nextColumn, minTimeToDestination + 1)) {
                        queueForDestinationTime.emplace(nextRow, nextColumn);
                        minTimeToFlood[nextRow][nextColumn] = VISITED;
                    }
                }
            }

            ++minTimeToDestination;
        }

        return IMPOSSIBLE_TO_REACH_DESTINATION;
    }

    void initializeMatrixMinTimeToFlood() {
        minTimeToFlood.resize(rows, vector<int>(columns, NOT_FLOODED));

        int floodTime = 0;
        queue<Point> queueForFloodTime;
        initializeQueueForFloodTime(queueForFloodTime, floodTime);

        while (!queueForFloodTime.empty()) {
            ++floodTime;
            for (size_t i = queueForFloodTime.size() - 1; i != variant_npos; --i) {
                Point current = queueForFloodTime.front();
                queueForFloodTime.pop();

                for (const auto& move : moves) {
                    size_t nextRow = current.row + move[0];
                    size_t nextColumn = current.column + move[1];
                    if (isValidPointToFlood(nextRow, nextColumn)) {
                        minTimeToFlood[nextRow][nextColumn] = floodTime;
                        queueForFloodTime.emplace(nextRow, nextColumn);
                    }
                }
            }
        }
    }

    void initializeQueueForFloodTime(queue<Point>& queueForFloodTime, int floodTime) {
        for (size_t r = 0; r < rows; ++r) {
            for (size_t c = 0; c < columns; ++c) {
                if ((*land)[r][c] == FLOODED) {
                    queueForFloodTime.emplace(r, c);
                    minTimeToFlood[r][c] = floodTime;
                }
            }
        }
    }

    void initializeQueueForDestinationTime(queue<Point>& queueForDestinationTime) const {
        for (size_t r = 0; r < rows; ++r) {
            for (size_t c = 0; c < columns; ++c) {
                if ((*land)[r][c] == START) {
                    queueForDestinationTime.emplace(r, c);
                    return;
                }
            }
        }
    }

    bool isValidPointToFlood(size_t row, size_t column) const {
        return isInBoundary(row, column)
                && minTimeToFlood[row][column] == NOT_FLOODED
                && ((*land)[row][column] == EMPTY
                || (*land)[row][column] == START);
    }

    bool isValidPointToStep(size_t row, size_t column, int currentTime) const {
        return isInBoundary(row, column)
                && ((minTimeToFlood[row][column] > currentTime
                && (*land)[row][column] == EMPTY)
                || (*land)[row][column] == DESTINATION);
    }

    bool isInBoundary(size_t row, size_t column) const {
        return row < rows && column < columns;
    }
};
