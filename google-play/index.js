'use strict';

var gplay = require('google-play-scraper');
var fs = require("fs");

// const readline = require('readline').createInterface({
//   input: process.stdin,
//   output: process.stdout
// })

// readline.question(`请输入 apk 包名：`, (inputText) => {
//   bundle_id = inputText
//   console.log(`包名： ${bundle_id}!`)

//   readline.close()

//   fs.mkdirSync(bundle_id)

//   gplay.reviews({
//     appId: bundle_id,
//     lang: 'kh'
//   })
//     .then((body) => {
//       fs.writeFile(`${bundle_id}/comments.json`, JSON.stringify(body), (err) => {
//         if (err) {
//           console.error(err);
//           return;
//         };
//         console.log("File has been created");
//       });
//     })
// })

var arr = [
  {
    'bundle_id': 'com.pipay.app.android',
    'name': 'PiPay'
  },
  // {
  //   'bundle_id': 'com.aeon_cambodia.rielpay',
  //   'name': 'AEON Wallet'
  // },
  // {
  //   'bundle_id': 'com.battlefun.c1game',
  //   'name': 'HyperFront'
  // }
  // {
  //   'bundle_id': 'th.co.truemoney.wallet',
  //   'name': 'True Money'
  // }
]

const total = 50
var paginateToken = "";




for (let i = 0; i < arr.length; i++) {
  const object = arr[i]
  var bundle_id, name
  if (object.hasOwnProperty('bundle_id')) {
    bundle_id = object['bundle_id'];

    if (!fs.existsSync(bundle_id)) {
      fs.mkdirSync(bundle_id)
    }
  }
  if (object.hasOwnProperty('bundle_id')) {
    name = object['name'];
  }

  console.log(`包名：${bundle_id}  应用名：${name}`)

  async function waitForPromise() {
    for (let index = 0; index < total; index++) {
      if (paginateToken == null)
        return;

      let promise = gplay.reviews({
        appId: bundle_id,
        num: 200,
        paginate: true,
        nextPaginationToken: paginateToken // you can omit this parameter
      })
      promise.then((body) => {
        if (body) {
          paginateToken = body["nextPaginationToken"];
          fs.writeFile(`${bundle_id}/${index}.json`, JSON.stringify(body), (err) => {
            if (err) {
              console.error(err);
              return;
            };
            console.log(`成功写入文件 ${bundle_id}/${index}.json`);
          });
        } else {
          console.log('无更多评论')
        }
      })
      await promise;
    }
  }
  waitForPromise();
}