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
     // Regex for YYYY-MM-DD format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
     // checks if todo_date is same as formatted date
    if (req.body.todo_date && dateRegex.test(req.body.todo_date)) {
      return next();
    } else {
      res.status(400).json({ error: "Invalid date format for todo_date. Must be in the format YYYY-MM-DD." });
    }
  };

module.exports = {
    checkTitle, checkDescription, checkDate
}