const urls = require('../data/urls-data');
const uses = require('../data/uses-data')

function list(req, res) {
  res.json({ data: urls });
}

function urlExists(req, res, next) {
  const { urlId } = req.params;
  const foundUrl = urls.find((url) => url.id === Number(urlId));
  if (foundUrl) {
    res.locals.url = foundUrl;
    return next();
  }
  next({
    status: 404,
    message: `Url id not found: ${urlId}`
  })
}

function hasHref(req, res, next) {
  const { data: { href } = {} } = req.body;
  
  if (href) {
    return next();
  }
  next({ status: 400, message: "A 'href' property is required." });
}

function read(req, res, next) {
  const newUse = {
    id: uses.length + 1,
    urlId: res.locals.url.id,
    time: Date.now()
  }
  uses.push(newUse);
  res.json({ data: res.locals.url })
}

function create(req, res) {
  const { data: { href } = {} } = req.body;
  const newUrl = {
    id: urls.length + 1,
    href,
  }
  urls.push(newUrl);
  res.status(201).json({ data: newUrl });
}

function update(req, res) {
  const url = res.locals.url;
  const { data: { href } = {} } = req.body;
  
  url.href = href;
  
  res.json({ data: url });
}

module.exports = {
  create: [hasHref, create],
  read: [urlExists, read],
  update: [urlExists, hasHref, update],
  list,
  urlExists
}