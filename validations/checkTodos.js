const checkTitle = (req, res, next) => {
    if (req.body.todo_title) {
      return next();
    } else {
      res.status(400).json({ error: "Title is required" });
    }
  };
  
  const checkDescription = (req, res, next) => {
    if (req.body.todo_description) {
      return next();
    } else {
      res.status(400).json({ error: "Description is required" });
    }
  };

  const checkDate = (req, res, next) => {
    if (req.body.todo_date) {
      return next();
    } else {
      res.status(400).json({ error: "Date is required" });
    }
  };

module.exports = {
    checkTitle, checkDescription, checkDate
}