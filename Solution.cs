
using System;
using System.Collections.Generic;

public class Solution
{
    private sealed record Point(int row, int column) { }

    private static readonly int[][] moves = new int[4][]{
        new int[]{ -1, 0 }, new int[]{ 1, 0 }, new int[]{ 0, -1 }, new int[]{ 0, 1 } };

    private static readonly string START = "S";
    private static readonly string DESTINATION = "D";
    private static readonly string EMPTY = ".";
    private static readonly string STONE = "X";
    private static readonly string FLOODED = "*";
    private static readonly int IMPOSSIBLE_TO_REACH_DESTINATION = -1;
    private static readonly int NOT_FLOODED = int.MaxValue;
    private static readonly int VISITED = 0;

    private int rows;
    private int columns;
    private IList<IList<String>>? land;
    private int[][]? minTimeToFlood;

    public int MinimumSeconds(IList<IList<string>> land)
    {
        rows = land.Count;
        columns = land[0].Count;
        this.land = land;
        initializeMatrixMinTimeToFlood();
        return findMinTimeToReachDestination();
    }

    private int findMinTimeToReachDestination()
    {
        Queue<Point> queueForDestinationTime = new Queue<Point>();
        InitializeQueueForDestinationTime(queueForDestinationTime);
        int minTimeToDestination = 0;

        while (queueForDestinationTime.Count > 0)
        {
            for (int i = queueForDestinationTime.Count - 1; i >= 0; --i)
            {
                Point current = queueForDestinationTime.Dequeue();
                if (land[current.row][current.column].Equals(DESTINATION))
                {
                    return minTimeToDestination;
                }

                foreach (int[] move in moves)
                {
                    int nextRow = current.row + move[0];
                    int nextColumn = current.column + move[1];
                    if (IsValidPointToStep(nextRow, nextColumn, minTimeToDestination + 1))
                    {
                        queueForDestinationTime.Enqueue(new Point(nextRow, nextColumn));
                        minTimeToFlood[nextRow][nextColumn] = VISITED;
                    }
                }
            }

            ++minTimeToDestination;
        }

        return IMPOSSIBLE_TO_REACH_DESTINATION;
    }

    private void initializeMatrixMinTimeToFlood()
    {
        minTimeToFlood = new int[rows][];
        for (int r = 0; r < rows; ++r)
        {
            minTimeToFlood[r] = new int[columns];
            Array.Fill(minTimeToFlood[r], NOT_FLOODED);
        }

        int floodTime = 0;
        Queue<Point> queueForFloodTime = new Queue<Point>();
        InitializeQueueForFloodTime(queueForFloodTime, floodTime);

        while (queueForFloodTime.Count > 0)
        {
            ++floodTime;
            for (int i = queueForFloodTime.Count - 1; i >= 0; --i)
            {
                Point current = queueForFloodTime.Dequeue();

                foreach (int[] move in moves)
                {
                    int nextRow = current.row + move[0];
                    int nextColumn = current.column + move[1];
                    if (IsValidPointToFlood(nextRow, nextColumn))
                    {
                        minTimeToFlood[nextRow][nextColumn] = floodTime;
                        queueForFloodTime.Enqueue(new Point(nextRow, nextColumn));
                    }
                }
            }
        }
    }

    private void InitializeQueueForFloodTime(Queue<Point> queueForFloodTime, int floodTime)
    {
        for (int r = 0; r < rows; ++r)
        {
            for (int c = 0; c < columns; ++c)
            {
                if (land[r][c].Equals(FLOODED))
                {
                    queueForFloodTime.Enqueue(new Point(r, c));
                    minTimeToFlood[r][c] = floodTime;
                }
            }
        }
    }

    private void InitializeQueueForDestinationTime(Queue<Point> queueForDestinationTime)
    {
        for (int r = 0; r < rows; ++r)
        {
            for (int c = 0; c < columns; ++c)
            {
                if (land[r][c].Equals(START))
                {
                    queueForDestinationTime.Enqueue(new Point(r, c));
                    return;
                }
            }
        }
    }

    private bool IsValidPointToFlood(int row, int column)
    {
        return IsInBoundary(row, column)
                && minTimeToFlood[row][column] == NOT_FLOODED
                && (land[row][column].Equals(EMPTY)
                || land[row][column].Equals(START));
    }

    private bool IsValidPointToStep(int row, int column, int currentTime)
    {
        return IsInBoundary(row, column)
                && ((minTimeToFlood[row][column] > currentTime
                && land[row][column].Equals(EMPTY))
                || land[row][column].Equals(DESTINATION));
    }

    private bool IsInBoundary(int row, int column)
    {
        return row >= 0 && row < rows && column >= 0 && column < columns;
    }
}
