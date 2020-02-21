'use strict';

const fs = require('fs');

if(process.argv.length < 3){
  console.log('Usage: node image_index.js <dir>');
  process.exit(1);
}

const EXTENSIONS = ['jpg', 'png', 'mp4', 'mkv', 'mpg', 'gif'];

async function run(dir){
  // console.log(`Indexing ${dir}`);
  const dirlist = await fs.promises.opendir(dir);
  const names = [];
  for await(const dirent of dirlist){
    // console.log(dirent);
    names.push(dirent.name);
  }
  console.log(JSON.stringify({ items: names}));
}

const dir = process.argv[2];
run(dir);
