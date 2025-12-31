const Denque = require("denque");

class KnightMovesGraph {
    constructor() {
        this.adjLists = this.buildAdjLists();
    }

    buildAdjLists() {
        const result = [];
        const moves = [[-1, +2], [+1, +2], [+2, +1], [+2, -1], [+1, -2], [-1, -2], [-2, -1], [-2, +1]];

        for (let i = 0; i < 64; i++) {
            // get coords correspondent to i
            const coords = [i % 8, Math.floor(i / 8)];
            result[i] = [];

            // get possible moves from coords
            for (let f = 0; f < moves.length; f++) {
                const movableCoord = [coords[0] + moves[f][0], coords[1] + moves[f][1]];

                const [x, y] = movableCoord;
                if (x >= 0 && x <= 7 && y >= 0 && y <= 7) result[i].push(movableCoord);
            }
        }
        return result;
    }

    getAdjacencyList(coord) {
        return this.adjLists[this.coordToIndex(coord)];
    }

    coordToIndex(coord) {
        return coord[0] + (8 * coord[1]);
    }

    indexToCoord(idx) {
        return [idx % 8, Math.floor(idx / 8)];
    }
}

function knightMoves(start, end) {
    const graph = new KnightMovesGraph();
    const dist = new Array(64).fill([Number.MAX_SAFE_INTEGER, null]);
    const q = new Denque();

    const idx = graph.coordToIndex(start);
    dist[idx] = [0, start];
    q.push([start, 0]);

    // get the distances of each coord to start
    while (!q.isEmpty()) {
        const [cur, dst] = q.shift();
        const idx = graph.coordToIndex(cur);
        
        // skip if there is already a smaller distance stored for this coord
        if (dst > dist[idx]) continue;
        
        // get adj list of coord
        const adj = graph.getAdjacencyList(cur);
        adj.forEach(a => {
            const i = graph.coordToIndex(a);
            const [d, lastCoord] = dist[i];

            // if its current distance to source is bigger than the distance of its
            // predecessor coord to src, update it
            if (d > dist[idx][0] + 1) {
                dist[i] = [dist[idx][0] + 1, cur];
                q.push([a, dist[i][0]]);
            }
        })
    }

    // compile the final result
    const result = [];
    let tmp = dist[graph.coordToIndex(end)];
    result.push(end);
    while (tmp[0] !== 0) {
        result.push(tmp[1]);
        tmp = dist[graph.coordToIndex(tmp[1])];
    }
    return result.reverse(); // return the reverse of the result array
}

// console.log(knightMoves([0, 0], [3, 3]));
// console.log(knightMoves([3, 3], [0, 0]));
// console.log(knightMoves([0,0], [7,7]));
// console.log(knightMoves([0,0], [0,0]));
console.log(knightMoves([5, 4], [0, 7]));