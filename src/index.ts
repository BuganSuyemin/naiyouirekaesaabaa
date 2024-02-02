import * as http from "http";
import fs, { writeFile } from "fs";
import path from "path";
import express from "express";
import cors from "cors";

//////////!!!!!!!!!!!!!!!!!!!!!!!!!!!! Перед справжнім запуском поставити
const СПРАВЖНІЙ_ЗАПУСК = false;

if (СПРАВЖНІЙ_ЗАПУСК) {
  fs.writeFile(
    path.join(__dirname, "../bd", "失敗したアイディ.json"),
    "",
    (err) => {
      if (err) {
        console.log(
          `Помилка при початковій очистці файлу 失敗したアイディ.json, оце так халепа`
        );
      }
    }
  );
  fs.writeFile(path.join(__dirname, "../bd", "履歴.txt"), "", (err) => {
    if (err) {
      console.log(
        `Помилка при записі початковій очистці файлу 履歴.txt, оце так халепа`
      );
    }
  });
}

let 失敗したアイディ = new Set();
let 完成したアイディ = new Set();
fs.readFile(
  path.join(__dirname, "../bd", "完成したアイディ.json"),
  { encoding: "utf-8" },
  (err, data) => {
    console.log("asdfbasdkfjhasdj");
    完成したアイディ = new Set(JSON.parse(data));
    console.log(data);
    if (err) {
      console.log(
        `Помилка при читанні файлу 完成したアイディ.json, оце так халепа`
      );
    }
  }
);
function だめじゃない化(文字列: string) {
  return 文字列.replace(/[.'\"\\\/:*?<>|]/g, "");
}

function dbに追加(req: http.IncomingMessage, chunk: any) {
  console.log("отримання шматку");

  try {
    let chjson = JSON.parse(chunk.toString("utf-8"));
    let fairumei = `${chjson["id"]}. ${だめじゃない化(chjson["назва"])}.JSON`;

    fs.writeFile(path.join(__dirname, "../bd/一覧", fairumei), chunk, (err) => {
      if (err) {
        console.log(err);
        console.log(`Помилка при записі файлу ${fairumei}`);
        fs.appendFile(
          path.join(__dirname, "../bd", "履歴.txt"),
          `Помилка при записі файлу ${fairumei}\n`,
          () => {}
        );

        失敗したアイディ.add(chjson["id"]);
        let a = JSON.stringify(Array.from(失敗したアイディ));
        fs.writeFile(
          path.join(__dirname, "../bd", "失敗したアイディ.json"),
          a,
          (err) => {
            if (err) {
              console.log(
                `Помилка при записі файлу 失敗したアイディ.json, оце так халепа`
              );
            }
          }
        );
      } else {
        console.log(`Успішно записано ${fairumei}`);
        完成したアイディ.add(chjson["id"]);
        let a = JSON.stringify(Array.from(完成したアイディ));
        fs.writeFile(
          path.join(__dirname, "../bd", "完成したアイディ.json"),
          a,
          (err) => {
            if (err) {
              console.log(
                `Помилка при записі файлу 完成したアイディ.json, оце так халепа`
              );
            }
          }
        );
        fs.appendFile(
          path.join(__dirname, "../bd", "履歴.txt"),
          `Успішно записано ${fairumei}\n`,
          (err) => {
            if (err) {
              console.log(`Помилка при записі файлу 履歴.txt, оце так халепа`);
            }
          }
        );
      }
    });
  } catch (e) {
    失敗したアイディ.add(req.headers["id"]);
    let a = JSON.stringify(Array.from(失敗したアイディ));
    fs.writeFile(
      path.join(__dirname, "../bd", "失敗したアイディ.json"),
      a,
      (err) => {
        if (err) {
          console.log(
            `Помилка при записі файлу 失敗したアイディ.json, оце так халепа`
          );
        }
      }
    );
    let 失敗情報 = `Помилка при записі ід ${req.headers["id"]}`;
    console.log(失敗情報);
    fs.appendFile(
      path.join(__dirname, "../bd", "履歴.txt"),
      `${失敗情報} \n`,
      () => {}
    );
  }
  // for (let i in chunk) console.log(i + chunk[i]);
}

function 完成したアイディを提供(res: http.ServerResponse) {
  let a = JSON.stringify(Array.from(完成したアイディ));
  res.end(a);
}

const server = http.createServer(
  (req: http.IncomingMessage, res: http.ServerResponse) => {
    console.log("\n");
    console.log("щось відбулось");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    console.log(req.method);
    req.on("data", (chunk) => {
      dbに追加(req, chunk);
    });
    res.end("asdfasdf");
  }
);

let app = express();

app.get("/kansei", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  完成したアイディを提供(res);
});


app.use(cors());
app.listen(5000, () => {
  console.log(`Server is listening at http://localhost:${5000}`);
});

server.listen(3000);
// fs.appendFile('prikol.json', "asdfsadffasd", () => {console.log('щось пишеться')})
// console.log("adf")
