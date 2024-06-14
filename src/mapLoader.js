import tmx from "tmx-parser";

async function loadMap() {
    const map = await new Promise((resolve, reject) => {
        tmx.parseFile("./src/tiledmap.tmx", (err, loadedMap) => {
            if(err) reject(err);
            resolve(loadedMap);
        });
    });
    const gidToSrcMap = map.tileSets
        .map(({firstGid,image}) => ({[firstGid]:image.source}))
        .reduce((acc, obj) => {
            for (const key in obj) acc[key] = obj[key];
            return acc;
        }, {});
    const keys = Object.keys(gidToSrcMap).map((key) => parseInt(key)).sort((a,b) => b - a);
    const getSrcFromGid = (gid) => {
        for (const key of keys) {
            if (key <= gid) return gidToSrcMap[key];
        }
    };

    const layers = map.layers;
    const tiles = layers.map((layer) => layer.tiles);
    // console.log(tiles[1])
    // console.log(tiles.length);
    // create a 2d array of map size height x width for each layer
    const maps2D = layers.map(() => new Array(map.height).fill('').map(() => new Array(map.width)));
    // console.log(maps2D.length);
    for(let map_ind=0; map_ind < maps2D.length; map_ind++){
        for(let row=0; row < map.height; row++){
            for(let col=0; col < map.width; col++){
                const tile = tiles[map_ind][row * map.width + col]
                try{
                    maps2D[map_ind][row][col] = {id: tile.id, gid: tile.gid, src: getSrcFromGid(tile.gid)};
                }catch(err){
                    maps2D[map_ind][row][col] = undefined;
                }
            }
        }
    }

    return maps2D;
    
}
export default loadMap;