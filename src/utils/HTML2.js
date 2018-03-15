export default HtmlFormatter = function (html) {
  let content = `<!DOCTYPE html><meta charset="utf-8">
    <meta name="viewport" content="initial-scale=1, maximum-scale=1, user-scalable=no, width=device-width">
    <meta content="telephone=no" name="format-detection">
    <title></title>
    <style>body{font-family: "微软雅黑",Arial, Helvetica, sans-serif;padding:0;margin:0;color:#9B9B9B;font-size:13px;}
    </style>
    <body>${html}</body></html>`;
  return content;
}
