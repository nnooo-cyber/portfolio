/**
 * generate-gallery.js
 * ------------------------------------------------------
 * works/monochrome/ と works/color/ フォルダの中身を自動スキャンして
 * gallery.json を作り直すビルドスクリプトです。
 *
 * Cloudflare Pages の「ビルドコマンド」にこのスクリプトを登録しておけば、
 * GitHub に push するたびに自動実行され、フォルダに入れた写真が
 * そのままサイトのギャラリーに反映されます。
 *
 * 使い方（ローカルで試す場合）:
 *   node generate-gallery.js
 *
 * 対応画像形式: .jpg / .jpeg / .png / .webp
 * ファイル名の昇順（001.jpg, 002.jpg ...）で並びます。
 * ------------------------------------------------------
 */

const fs = require('fs');
const path = require('path');

const WORKS_DIR = path.join(__dirname, 'works');
const CATEGORIES = ['monochrome', 'color'];
const VALID_EXT = ['.jpg', '.jpeg', '.png', '.webp'];
const OUTPUT_FILE = path.join(__dirname, 'gallery.json');

function listImages(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((file) => VALID_EXT.includes(path.extname(file).toLowerCase()))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true })) // 001, 002, 010 のように自然順ソート
    .map((file) => ({
      src: `works/${path.basename(dir)}/${file}`,
      alt: path.basename(file, path.extname(file)), // ファイル名を仮のalt文字列として使用
    }));
}

function main() {
  const result = {};

  CATEGORIES.forEach((category) => {
    const dir = path.join(WORKS_DIR, category);
    result[category] = listImages(dir);
    console.log(`[generate-gallery] ${category}: ${result[category].length} 枚検出`);
  });

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(result, null, 2) + '\n', 'utf-8');
  console.log(`[generate-gallery] gallery.json を書き出しました → ${OUTPUT_FILE}`);
}

main();
