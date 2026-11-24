function middlewareLogger(req, res, next) {
  console.log(`middleware running: ${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
}

export { middlewareLogger };