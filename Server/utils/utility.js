export const wrapasync = (fx) => (req, res, next) => {
  Promise.resolve(fx(req, res, next)).catch((errr) => next(errr));
};
