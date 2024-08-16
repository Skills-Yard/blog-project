const express = require("express");
const router = express.Router();
const { staticLoginGET, staticLoginPOST, staticLogoutGET, staticGET } = require("../controller/static")


router.route("/login")
  .get(staticLoginGET)
  .post(staticLoginPOST)


router.get("/", staticGET);

router.get("/logout", staticLogoutGET)

module.exports.static = router;