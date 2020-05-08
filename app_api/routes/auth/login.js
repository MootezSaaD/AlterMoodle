const Router = require("express").Router;
const { loginValidation } = require("../../validators/joiValidator");
const authService = require("../../services/auth.service")();

const router = Router({
  mergeParams: true
});
// Login
router.post("/login", async (req, res, next) => {
  try {
    if(req.body.NameValuePairs == null){
      loginValidation(req.body);
      const { email, password } = req.body;
      const user = await authService.login(email, password);
      res.send(user);
    }else{
      loginValidation(req.body.NameValuePairs);
      const { email, password } = req.body.NameValuePairs;
      const user = await authService.login(email, password);
      res.send(user);
    }
  
  } catch (err) {
    next(err);
  }
});

module.exports = router;
