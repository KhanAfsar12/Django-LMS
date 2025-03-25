def run():

    """To find the number of islands in the given 2D grid, an island is defined as a group of 1s (land) 
    connected horizontally or vertically (not diagonally). The problem can be solved using Depth First
    Search (DFS) or Breadth First Search (BFS)."""
    def num_islands(grid):
        def dfs(grid, i, j):
            if i<0 or i>=len(grid) or j<0 or j>=len(grid[0]) or grid[i][j] == 0:
                return
            grid[i][j] = 0
            dfs(grid, i+1, j)
            dfs(grid, i-1, j)
            dfs(grid, i, j+1)
            dfs(grid, i, j-1)

        if not grid:
            return 0
        
        count = 0

        for i in range(len(grid)):
            for j in range(len(grid[0])):
                if grid[i][j]  == 1:
                    count += 1
                    dfs(grid, i, j)
        return count


    lst = [
        [1,1,0,0,0],
        [1,1,0,0,0],
        [0,0,1,0,0],
        [0,0,0,1,1]
    ]

    print("Number of Islands, ", num_islands(lst))