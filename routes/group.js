const express = require("express");
const groupController = require("../controllers/groupController");
const router = express.Router();

router.get("/", groupController.getGroups);
router.get("/my-groups", groupController.getMyGroups);
router.post("/", groupController.createGroup);

const singleGroupRouter = express.Router({mergeParams: true});

router.use("/:id",singleGroupRouter);

singleGroupRouter.get("/", groupController.getGroup);
singleGroupRouter.get("/members", groupController.getGroupMembers);
singleGroupRouter.put("/", groupController.updateGroup);


module.exports = router;