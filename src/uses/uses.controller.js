const uses = require('../data/uses-data');

function list(req, res) {
  res.json({ data:  uses });
}

function create(req, res, next) {
  next();
}

function useExists(req, res, next) {
  const { useId } = req.params;
  const foundUse = uses.find((use) => use.id === Number(useId));
  if (foundUse) {
    res.locals.use = foundUse;
    return next();
  }
  next({
    status: 404,
    message: `Rating id not found: ${useId}`
  })
}

function hasTime(req, res, next) {
  const { data: { time} = {} } = req.body;
  
  if (time) {
    return next();
  }
  next({ status: 400, message: "A 'time' property is required." });
}

function read(req, res) {
  res.json({ data: res.locals.use });
}

function update(req, res, next) {
  next();
}

function destroy(req, res, next) {
  const { useId } = req.params;
  const index = uses.findIndex((use) => use.id === Number(useId));
  if (index > -1) {
    uses.splice(index, 1);
    res.sendStatus(204)
  }
}

module.exports = {
  list,
  create: create,
  read: [useExists, read],
  update: [useExists, hasTime, update],
  delete: [useExists, destroy]
}