// Generates pixel art PNG sprites for SOULBOUND
const zlib = require('zlib');
const fs = require('fs');
const path = require('path');

function makePNG(grid, scale=4) {
  const h = grid.length, w = grid[0].length;
  const W = w*scale, H = h*scale;

  // CRC32 table
  const table = [];
  for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=(c&1)?0xedb88320^(c>>>1):c>>>1;table[n]=c;}
  function crc32(buf){let c=0xffffffff;for(let i=0;i<buf.length;i++)c=table[(c^buf[i])&0xff]^(c>>>8);return(c^0xffffffff)>>>0;}

  function chunk(type, data){
    const hdr=Buffer.from(type,'ascii');
    const body=Buffer.concat([hdr,data]);
    const crc=crc32(body);
    const r=Buffer.alloc(4+4+data.length+4);
    r.writeUInt32BE(data.length,0);
    hdr.copy(r,4);
    data.copy(r,8);
    r.writeUInt32BE(crc,8+data.length);
    return r;
  }

  const raw=[];
  for(let y=0;y<H;y++){
    raw.push(0);
    for(let x=0;x<W;x++){
      const px=grid[Math.floor(y/scale)][Math.floor(x/scale)];
      if(!px){raw.push(0,0,0,0);}
      else{const c=parseInt(px.replace('#',''),16);raw.push((c>>16)&0xff,(c>>8)&0xff,c&0xff,255);}
    }
  }

  const ihdr=Buffer.alloc(13);
  ihdr.writeUInt32BE(W,0);ihdr.writeUInt32BE(H,4);
  ihdr.writeUInt8(8,8);ihdr.writeUInt8(6,9);

  return Buffer.concat([
    Buffer.from([137,80,78,71,13,10,26,10]),
    chunk('IHDR',ihdr),
    chunk('IDAT',zlib.deflateSync(Buffer.from(raw),{level:9})),
    chunk('IEND',Buffer.alloc(0)),
  ]);
}

// Sprite definitions — 16x16, null = transparent
const _ = null;

// Colors
const [B,b,Bd] = ['#4488ff','#2255cc','#001155'];  // blue armor
const [S,Sd]   = ['#ffcc99','#cc9966'];             // skin
const [H,Hd]   = ['#442200','#221100'];             // hair/dark brown
const [W,Wh]   = ['#ffffff','#dddddd'];             // white
const [Gr,GR]  = ['#888888','#555555'];             // gray
const [Ye]     = ['#ffee44'];                        // yellow
const [Re]     = ['#ff3322'];                        // red
const [Pu,pd]  = ['#aa55ff','#7722cc'];             // purple
const [Or,od]  = ['#ff8833','#cc5500'];             // orange
const [Bn,bn]  = ['#aa7744','#775522'];             // brown
const [Gr2,g2] = ['#44cc44','#228822'];             // green
const [Cy]     = ['#44ccff'];                        // cyan

const SPRITES = {

// ── PLAYER ─────────────────────────────────────────────────
player: [
  [_,_,_,_,_,H,Hd,Hd,H,_,_,_,_,_,_,_],
  [_,_,_,_,H,S,S,S,S,H,_,_,_,_,_,_],
  [_,_,_,_,H,S,Hd,S,S,H,_,_,_,_,_,_],
  [_,_,_,_,H,S,S,S,S,H,_,_,_,_,_,_],
  [_,_,_,_,_,Hd,S,S,Hd,_,_,_,_,_,_,_],
  [_,_,_,B,B,B,B,B,B,B,B,_,_,_,_,_],
  [_,_,_,B,b,B,B,B,B,b,B,_,_,_,_,_],
  [_,_,Ye,B,B,B,B,B,B,B,B,_,_,_,_,_],
  [_,_,Ye,B,B,B,B,B,B,B,B,_,_,_,_,_],
  [_,_,Ye,B,B,B,B,B,B,B,B,_,_,_,_,_],
  [_,_,_,B,B,_,_,B,_,_,B,_,_,_,_,_],
  [_,_,_,_,B,_,_,B,_,_,B,_,_,_,_,_],
  [_,_,_,Bn,bn,_,_,_,_,Bn,bn,_,_,_,_,_],
  [_,_,_,Bn,_,_,_,_,_,_,Bn,_,_,_,_,_],
  [_,_,_,Hd,Bn,_,_,_,_,Bn,Hd,_,_,_,_,_],
  [_,_,_,Hd,_,_,_,_,_,_,Hd,_,_,_,_,_],
],

// ── SKELETON ──────────────────────────────────────────────
skeleton: [
  [_,_,_,_,Wh,W,W,W,W,Wh,_,_,_,_,_,_],
  [_,_,_,W,W,W,W,W,W,W,W,_,_,_,_,_],
  [_,_,_,W,Hd,W,W,W,Hd,W,_,_,_,_,_,_],
  [_,_,_,W,W,W,W,W,W,W,W,_,_,_,_,_],
  [_,_,_,_,Wh,W,W,W,W,Wh,_,_,_,_,_,_],
  [_,_,_,GR,W,GR,W,W,GR,W,GR,_,_,_,_,_],
  [_,_,_,W,W,W,W,W,W,W,W,_,_,_,_,_],
  [_,_,_,W,W,W,W,W,W,W,W,_,_,_,_,_],
  [_,_,_,W,W,GR,W,W,GR,W,W,_,_,_,_,_],
  [_,_,_,W,W,W,W,W,W,W,W,_,_,_,_,_],
  [_,_,_,Wh,W,_,W,W,_,W,Wh,_,_,_,_,_],
  [_,_,_,Wh,_,_,W,W,_,_,Wh,_,_,_,_,_],
  [_,_,Wh,W,W,_,_,_,_,W,W,Wh,_,_,_,_],
  [_,_,Wh,W,_,_,_,_,_,_,W,Wh,_,_,_,_],
  [_,_,_,Wh,Wh,_,_,_,_,Wh,Wh,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
],

// ── WISP ──────────────────────────────────────────────────
wisp: [
  [_,_,_,_,_,Pu,Pu,Pu,_,_,_,_,_,_,_,_],
  [_,_,_,_,Pu,pd,pd,pd,Pu,_,_,_,_,_,_,_],
  [_,_,_,Pu,pd,Pu,Pu,Pu,pd,Pu,_,_,_,_,_,_],
  [_,_,_,Pu,Pu,W,Pu,W,Pu,Pu,_,_,_,_,_,_],
  [_,_,_,Pu,pd,Pu,Pu,Pu,pd,Pu,_,_,_,_,_,_],
  [_,_,Pu,pd,pd,Pu,Pu,Pu,pd,pd,Pu,_,_,_,_,_],
  [_,Pu,Pu,pd,Pu,Pu,Pu,Pu,Pu,pd,Pu,Pu,_,_,_,_],
  [_,Pu,Pu,Pu,Pu,Pu,Pu,Pu,Pu,Pu,Pu,Pu,_,_,_,_],
  [_,Pu,Pu,Pu,pd,Pu,Pu,Pu,Pu,pd,Pu,Pu,_,_,_,_],
  [_,_,Pu,Pu,Pu,Pu,Pu,Pu,Pu,Pu,Pu,_,_,_,_,_],
  [_,_,_,Pu,Pu,pd,Pu,Pu,pd,Pu,_,_,_,_,_,_],
  [_,_,Pu,_,Pu,Pu,Pu,Pu,Pu,_,Pu,_,_,_,_,_],
  [_,Pu,_,_,_,Pu,Pu,Pu,_,_,_,Pu,_,_,_,_],
  [_,_,_,_,_,_,Pu,_,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
],

// ── DEMON ─────────────────────────────────────────────────
demon: [
  [_,_,Re,_,_,_,_,_,_,_,Re,_,_,_,_,_],
  [_,Re,Re,Re,_,_,_,_,_,Re,Re,Re,_,_,_,_],
  [_,_,Re,Or,Or,Or,Or,Or,Or,Or,Re,_,_,_,_,_],
  [_,_,Or,od,Or,Or,Or,Or,Or,od,Or,_,_,_,_,_],
  [_,_,Or,Or,Or,Or,Or,Or,Or,Or,Or,_,_,_,_,_],
  [_,_,_,Or,Re,Or,Or,Or,Re,Or,_,_,_,_,_,_],
  [_,_,Or,Or,Or,Or,Or,Or,Or,Or,Or,_,_,_,_,_],
  [_,Or,Or,Or,Or,Or,Or,Or,Or,Or,Or,Or,_,_,_,_],
  [_,Or,Or,od,Or,Or,Or,Or,Or,od,Or,Or,_,_,_,_],
  [_,Or,Or,Or,Or,Or,Or,Or,Or,Or,Or,Or,_,_,_,_],
  [_,_,Or,Or,Or,_,Or,Or,_,Or,Or,_,_,_,_,_],
  [_,_,_,Or,Or,_,Or,Or,_,Or,Or,_,_,_,_,_],
  [_,_,Re,Or,Or,_,_,_,_,Or,Or,Re,_,_,_,_],
  [_,_,Re,Or,_,_,_,_,_,_,Or,Re,_,_,_,_],
  [_,_,_,Re,Re,_,_,_,_,Re,Re,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
],

// ── SOUL ORB ──────────────────────────────────────────────
orb: [
  [_,_,_,_,_,Ye,Ye,Ye,_,_,_,_,_,_,_,_],
  [_,_,_,_,Ye,W,W,Ye,Ye,_,_,_,_,_,_,_],
  [_,_,_,Ye,W,Ye,Ye,W,Ye,Ye,_,_,_,_,_,_],
  [_,_,Ye,Ye,Ye,Ye,Ye,Ye,Ye,Ye,Ye,_,_,_,_,_],
  [_,_,Ye,Ye,Ye,Ye,Ye,Ye,Ye,Ye,Ye,_,_,_,_,_],
  [_,_,_,Ye,W,Ye,Ye,W,Ye,Ye,_,_,_,_,_,_],
  [_,_,_,_,Ye,Ye,Ye,Ye,Ye,_,_,_,_,_,_,_],
  [_,_,_,_,_,Ye,Ye,Ye,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
],

// ── FLOOR TILE (16x16 stone) ──────────────────────────────
floor: (() => {
  const F = '#1a1a2e', f = '#222244', fd = '#141430', fb = '#1e1e3a';
  return [
    [F,F,f,f,f,f,fd,fd,fd,fd,f,f,f,F,F,F],
    [F,f,f,fb,fb,f,fd,fd,fd,f,fb,fb,f,f,F,F],
    [f,f,fb,fb,f,f,fd,fd,f,f,f,fb,fb,f,f,F],
    [f,fb,fb,f,f,f,f,f,f,f,f,f,fb,fb,f,F],
    [f,fb,f,f,f,f,f,f,f,f,f,f,f,fb,f,F],
    [f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f],
    [fd,fd,fd,f,f,f,f,f,f,f,f,f,fd,fd,fd,fd],
    [fd,fd,f,f,f,f,f,f,f,f,f,f,f,fd,fd,fd],
    [fd,fd,f,f,f,fb,fb,fb,fb,f,f,f,f,fd,fd,fd],
    [f,f,f,f,fb,fb,f,f,fb,fb,f,f,f,f,f,f],
    [f,f,f,fb,fb,f,f,f,f,fb,fb,f,f,f,f,f],
    [f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f],
    [f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f],
    [F,f,f,f,f,f,f,f,f,f,f,f,f,f,F,F],
    [F,F,f,f,f,f,f,f,f,f,f,f,f,F,F,F],
    [F,F,F,f,f,f,f,f,f,f,f,f,F,F,F,F],
  ];
})(),

// ── WALL TILE ─────────────────────────────────────────────
wall: (() => {
  const W1='#2a2a44',W2='#333355',W3='#3d3d66',W4='#1a1a33',W5='#444477';
  return [
    [W4,W4,W4,W4,W4,W4,W4,W4,W4,W4,W4,W4,W4,W4,W4,W4],
    [W4,W2,W2,W2,W2,W2,W2,W2,W2,W2,W2,W2,W2,W2,W4,W4],
    [W4,W2,W3,W3,W3,W3,W3,W3,W3,W3,W3,W3,W3,W2,W4,W4],
    [W4,W2,W3,W5,W5,W5,W5,W5,W5,W5,W5,W5,W3,W2,W4,W4],
    [W4,W2,W3,W5,W1,W1,W1,W1,W1,W1,W1,W5,W3,W2,W4,W4],
    [W4,W2,W3,W5,W1,W2,W2,W1,W2,W2,W1,W5,W3,W2,W4,W4],
    [W4,W2,W3,W5,W1,W2,W3,W1,W3,W2,W1,W5,W3,W2,W4,W4],
    [W4,W2,W3,W5,W1,W1,W1,W1,W1,W1,W1,W5,W3,W2,W4,W4],
    [W4,W2,W3,W5,W5,W5,W5,W5,W5,W5,W5,W5,W3,W2,W4,W4],
    [W4,W2,W3,W3,W3,W3,W3,W3,W3,W3,W3,W3,W3,W2,W4,W4],
    [W4,W2,W2,W2,W2,W2,W2,W2,W2,W2,W2,W2,W2,W2,W4,W4],
    [W4,W4,W4,W4,W4,W4,W4,W4,W4,W4,W4,W4,W4,W4,W4,W4],
    [W4,W4,W4,W4,W4,W4,W4,W4,W4,W4,W4,W4,W4,W4,W4,W4],
    [W4,W4,W4,W4,W4,W4,W4,W4,W4,W4,W4,W4,W4,W4,W4,W4],
    [W4,W4,W4,W4,W4,W4,W4,W4,W4,W4,W4,W4,W4,W4,W4,W4],
    [W4,W4,W4,W4,W4,W4,W4,W4,W4,W4,W4,W4,W4,W4,W4,W4],
  ];
})(),

// ── DOOR CLOSED ───────────────────────────────────────────
door_closed: (() => {
  const D='#2a1a1a',d='#3d2222',Db='#4a2a2a',DL='#663333',Dk='#8b4513';
  return [
    [D,D,D,D,D,D,D,D,D,D,D,D,D,D,D,D],
    [D,Db,Db,Db,Db,Db,Db,Db,Db,Db,Db,Db,Db,Db,D,D],
    [D,Db,DL,DL,DL,DL,DL,DL,DL,DL,DL,DL,DL,Db,D,D],
    [D,Db,DL,d,d,d,d,d,d,d,d,d,DL,Db,D,D],
    [D,Db,DL,d,Dk,Dk,Dk,Dk,Dk,Dk,d,DL,Db,D,D],
    [D,Db,DL,d,Dk,DL,DL,Dk,DL,Dk,d,DL,Db,D,D],
    [D,Db,DL,d,Dk,DL,D,Dk,D,Dk,d,DL,Db,D,D],
    [D,Db,DL,d,Dk,Dk,Dk,Dk,Dk,Dk,d,DL,Db,D,D],
    [D,Db,DL,d,d,d,d,d,d,d,d,d,DL,Db,D,D],
    [D,Db,DL,DL,DL,DL,DL,DL,DL,DL,DL,DL,DL,Db,D,D],
    [D,Db,Db,Db,Db,Db,Db,Db,Db,Db,Db,Db,Db,Db,D,D],
    [D,D,D,D,D,D,D,D,D,D,D,D,D,D,D,D],
    [D,D,D,D,D,D,D,D,D,D,D,D,D,D,D,D],
    [D,D,D,D,D,D,D,D,D,D,D,D,D,D,D,D],
    [D,D,D,D,D,D,D,D,D,D,D,D,D,D,D,D],
    [D,D,D,D,D,D,D,D,D,D,D,D,D,D,D,D],
  ];
})(),

// ── DOOR OPEN ─────────────────────────────────────────────
door_open: (() => {
  const O='#001100',o='#002200',OL='#00cc44',ob='#008833',ow='#00ff66';
  return [
    [O,O,O,O,O,O,O,O,O,O,O,O,O,O,O,O],
    [O,ob,ob,ob,ob,ob,ob,ob,ob,ob,ob,ob,ob,ob,O,O],
    [O,ob,OL,OL,OL,OL,OL,OL,OL,OL,OL,OL,OL,ob,O,O],
    [O,ob,OL,o,o,o,o,o,o,o,o,o,OL,ob,O,O],
    [O,ob,OL,o,ow,ow,ow,ow,ow,ow,o,OL,ob,O,O],
    [O,ob,OL,o,ow,OL,OL,ow,OL,ow,o,OL,ob,O,O],
    [O,ob,OL,o,ow,OL,O,ow,O,ow,o,OL,ob,O,O],
    [O,ob,OL,o,ow,ow,ow,ow,ow,ow,o,OL,ob,O,O],
    [O,ob,OL,o,o,o,o,o,o,o,o,o,OL,ob,O,O],
    [O,ob,OL,OL,OL,OL,OL,OL,OL,OL,OL,OL,OL,ob,O,O],
    [O,ob,ob,ob,ob,ob,ob,ob,ob,ob,ob,ob,ob,ob,O,O],
    [O,O,O,O,O,O,O,O,O,O,O,O,O,O,O,O],
    [O,O,O,O,O,O,O,O,O,O,O,O,O,O,O,O],
    [O,O,O,O,O,O,O,O,O,O,O,O,O,O,O,O],
    [O,O,O,O,O,O,O,O,O,O,O,O,O,O,O,O],
    [O,O,O,O,O,O,O,O,O,O,O,O,O,O,O,O],
  ];
})(),

// ── PROJECTILE ────────────────────────────────────────────
proj: [
  [_,Pu,Pu,_],
  [Pu,W,W,Pu],
  [Pu,W,W,Pu],
  [_,Pu,Pu,_],
],

};

// Write all sprites
const outDir = path.join(__dirname, 'assets');
if(!fs.existsSync(outDir)) fs.mkdirSync(outDir);

Object.entries(SPRITES).forEach(([key, grid]) => {
  const scale = key === 'proj' ? 2 : (key === 'floor' || key === 'wall' ? 1 : 2);
  const buf = makePNG(grid, scale);
  const file = path.join(outDir, `${key}.png`);
  fs.writeFileSync(file, buf);
  console.log(`✓ ${key}.png (${grid[0].length*scale}x${grid.length*scale}px)`);
});

console.log('\nAll sprites generated in assets/');
