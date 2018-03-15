export default HtmlFormatter = function (title, date, html) {
  let content = `<!DOCTYPE html><meta charset="utf-8">
    <meta name="viewport" content="initial-scale=1, maximum-scale=1, user-scalable=no, width=device-width">
    <meta content="telephone=no" name="format-detection">
    <title></title>
    <style>body{font-family: "微软雅黑",Arial, Helvetica, sans-serif;margin:0;color:#999999;font-size:13px;padding:10px;padding-top:20px;padding-bottom:50px;}
    .title{font-size:18px;color:#333333;}
    .date{font-size:14;line-height:30px;}
    </style>
    <body><div class="title">${title}</div><div class="date">${date}</div>${html}</body></html>`;
  return content;
}
