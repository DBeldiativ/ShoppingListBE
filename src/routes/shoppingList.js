const express = require("express");
const router = express.Router();
const validate = require("../middlewares/validate");
const checkRole = require("../middlewares/auth");
const {
  createShoppingListSchema,
  deleteShoppingListSchema,
  addItemSchema,
  markItemSchema,
  inviteMemberSchema,
  renameShoppingListSchema,
} = require("../utils/validation");

// POST /shopping-list/create
router.post("/create", checkRole("owner"), validate(createShoppingListSchema), (req, res) => {
  res.json({
    shoppingListId: "generated-id",
    name: req.body.name,
    description: req.body.description,
    createdAt: new Date().toISOString(),
    uuAppErrorMap: {},
  });
});

// DELETE /shopping-list/delete/:id
router.delete("/delete/:id", checkRole("owner"), (req, res) => {
  const shoppingListId = req.params.id;

  res.json({
    status: "deleted",
    shoppingListId,
    uuAppErrorMap: {},
  });
});

// POST /shopping-list/:id/add-item
router.post("/:id/add-item", checkRole(["owner", "member"]), validate(addItemSchema), (req, res) => {
  const shoppingListId = req.params.id;
  const { itemName, quantity, unit } = req.body;

  res.json({
    shoppingListId,
    itemId: "generated-item-id",
    itemName,
    quantity,
    unit,
    addedAt: new Date().toISOString(),
    uuAppErrorMap: {},
  });
});

// DELETE /shopping-list/:id/remove-item/:itemId
router.delete("/:id/remove-item/:itemId", checkRole(["owner", "member"]), (req, res) => {
  const shoppingListId = req.params.id;
  const itemId = req.params.itemId;

  res.json({
    shoppingListId,
    removedItemId: itemId,
    removedAt: new Date().toISOString(),
    uuAppErrorMap: {},
  });
});

// GET /shopping-list/accessible
router.get("/accessible", checkRole(["owner", "member"]), (req, res) => {
  res.json({
    shoppingLists: [
      { id: "1", name: "Víkendový nákup" },
      { id: "2", name: "Týdenní potraviny" },
    ],
    uuAppErrorMap: {},
  });
});

// PUT /shopping-list/:id/mark-item/:itemId
router.put("/:id/mark-item/:itemId", checkRole(["owner", "member"]), validate(markItemSchema), (req, res) => {
  const shoppingListId = req.params.id;
  const itemId = req.params.itemId;
  const { isCompleted } = req.body;

  res.json({
    shoppingListId,
    itemId,
    isCompleted,
    markedAt: new Date().toISOString(),
    uuAppErrorMap: {},
  });
});

// POST /shopping-list/:id/invite
router.post("/:id/invite", checkRole("owner"), validate(inviteMemberSchema), (req, res) => {
  const shoppingListId = req.params.id;
  const { email } = req.body;

  res.json({
    shoppingListId,
    invitedEmail: email,
    invitationSentAt: new Date().toISOString(),
    uuAppErrorMap: {},
  });
});

// PUT /shopping-list/:id/rename
router.put("/:id/rename", checkRole("owner"), validate(renameShoppingListSchema), (req, res) => {
  const shoppingListId = req.params.id;
  const { newName } = req.body;

  res.json({
    shoppingListId,
    newName,
    renamedAt: new Date().toISOString(),
    uuAppErrorMap: {},
  });
});

// POST /shopping-list/:id/archive
router.post("/:id/archive", checkRole("owner"), (req, res) => {
  const shoppingListId = req.params.id;

  res.json({
    shoppingListId,
    status: "archived",
    archivedAt: new Date().toISOString(),
    uuAppErrorMap: {},
  });
});

// POST /shopping-list/:id/restore
router.post("/:id/restore", checkRole("owner"), (req, res) => {
  const shoppingListId = req.params.id;

  res.json({
    shoppingListId,
    status: "restored",
    restoredAt: new Date().toISOString(),
    uuAppErrorMap: {},
  });
});

module.exports = router;


