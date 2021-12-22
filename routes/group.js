const express = require("express");
const groupController = require("../controllers/groupController");
const router = express.Router();
const {verifyLogin} = require("../middlewares/verifyLogin");

router.get("/", verifyLogin, groupController.getGroups);
router.get("/my-groups",verifyLogin, groupController.getMyGroups);
router.post("/",verifyLogin, groupController.createGroup);
router.post("/join", verifyLogin, groupController.joinGroup);

const singleGroupRouter = express.Router({mergeParams: true});

router.use("/:id", verifyLogin, singleGroupRouter);

singleGroupRouter.get("/", groupController.getGroup);
singleGroupRouter.get("/members", groupController.getGroupMembers);
singleGroupRouter.put("/", groupController.updateGroup);
singleGroupRouter.get("/invite-link", groupController.generateGroupLink)


module.exports = router;