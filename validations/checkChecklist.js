const checkCheckListDescription = (req, res, next) => {
    if (req.body.checklist_description) {
      return next();
    } else {
      res.status(400).json({ error: "Description is required" });
    }
  };

 module.exports = { checkCheckListDescription };