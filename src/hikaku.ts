import fs from "fs";
import path from "path";
import { 事項 } from "./事項";

const jojo1id = 544;
const jojo2id = 7345;
const jojo3id = 7397;
const jojo4id = 7398;
const jojo5id = 7399;

const jojoid = [jojo1id, jojo2id, jojo3id, jojo4id, jojo5id];

function アイディでファイル名(アイディ: string | number) {
  let 使えるアイディ = アイディ.toString() + ".";
  const 全部ファイル = fs.readdirSync(path.join(__dirname, "../bd/一覧"));
  return 全部ファイル.filter((ファイル) =>
    ファイル.startsWith(使えるアイディ)
  )[0];
}

function ファイル名でオブジェクト(ファイル名: string) {
  let ファイル内容 = fs.readFileSync(
    path.join(__dirname, "../bd/一覧", ファイル名),
    {
      encoding: "utf-8",
    }
  );
  let 結果 = JSON.parse(ファイル内容);
  return 結果 as 事項;
}

function アイディで単語一覧(アイディ: string | number) {
  return (ファイル名でオブジェクト(アイディでファイル名(アイディ)) as 事項)[
    "список_слів"
  ];
}

function 複数アイディで単語一覧(アイディ: string[] | number[]) {
  let 結果 = [];
  for (let い of アイディ)
    結果.push(
      (ファイル名でオブジェクト(アイディでファイル名(い)) as 事項)[
        "список_слів"
      ]
    );
  return 結果;
}

/// якщо число або строка, то айді файлу
export function 比べる(
  一: string[] | number[] | 事項[] | string | number | 事項,
  二: string[] | number[] | 事項[] | string | number | 事項
) {
  let 一単語: string[] = [];
  let 二単語: string[] = [];
  let 第一: (string | number | 事項)[] = [];
  let 第二: (string | number | 事項)[] = [];

  if (!Array.isArray(一)) 第一[0] = 一;
  else 第一 = [...一];

  if (!Array.isArray(二)) 第二[0] = 二;
  else 第二 = [...二];

  if (typeof 第一[0] === "object")
    for (let i of 第一 as 事項[]) 一単語.push(...i["список_слів"]);
  else for (let i of 第一 as (string|number)[]) 一単語.push(...アイディで単語一覧(i));

  if (typeof 第二[0] === "object")
    for (let i of 第二 as 事項[]) 二単語.push(...i["список_слів"]);
  else for (let i of 第二 as (string|number)[]) 二単語.push(...アイディで単語一覧(i));


  let 結果 = 0;
  for (let a of 一単語) {
    二単語.includes(a) ? 結果++ : 0;
  }
  return 結果;
}

// const 大結果: { アニメ名: string; 結果: number }[] = [];
// const 全部ファイル名 = fs.readdirSync(path.join(__dirname, "../bd/一覧"));
// let 最大ファイル名 = "";
// let 最大数値 = 0;

// for (let ファイル名 of 全部ファイル名) {
//   let 第二 = ファイル名でオブジェクト(ファイル名);
//   let アニメ名 = 第二["назва"];
//   let 話数 = 第二["кількість_серій"];

//   let 結果 = 比べる(アイディでファイル名(544), 第二) / (話数 === 1 ? 4 : 話数);
//   大結果.push({ アニメ名, 結果 });
// }

// console.log(最大ファイル名);
// console.log(最大数値);

// 大結果.sort((a, b) => {
//   if (a.結果 > b.結果) return b.結果 - a.結果;
//   return 0;
// });

// fs.writeFileSync(path.join(__dirname, "../bd", "大成功.txt"), "");
// for (let a of 大結果) {
//   fs.appendFile(
//     path.join(__dirname, "../bd", "大成功.txt"),
//     a.アニメ名 + ": " + a.結果 + "\n",
//     () => {}
//   );
// }

// fs.writeFileSync(path.join(__dirname, "../bd", "比較結果2.txt"), "");

// let 第二オブジェクト = ファイル名でオブジェクト(アイディでファイル名(864));
// let 一単語: string[] = [];
// let 二単語 = 第二オブジェクト["список_слів"];
// for (let id of jojoid) {
//   一単語.push(
//     ...ファイル名でオブジェクト(アイディでファイル名(id))["список_слів"]
//   );
// }

// let 結果: string[] = [];
// for (let a of 一単語) {
//   if (二単語.includes(a) && !結果.includes(a)) 結果.push(a);
// }

// for (const a of 結果) {
//   fs.appendFileSync(path.join(__dirname, "../bd", "比較結果2.txt"), a + "\n");
// }

const 追加情報 = process.argv.slice(2);

if (追加情報.length == 1) {
  let a = 比べる(追加情報[0], jojoid);
  console.log(a);
}
