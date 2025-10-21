export const sendResponse = (res, success, data = null, message = "") => {
  res.status(success ? 200 : 400).json({ success, data, message });
};
