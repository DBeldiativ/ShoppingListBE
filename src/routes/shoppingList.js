const shoppingLists = [];
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
  const newShoppingList = {
    id: `${Date.now()}`, // Unikátní ID (použijeme timestamp)
    name: req.body.name,
    description: req.body.description || "", // Popis může být volitelný
    createdAt: new Date().toISOString(),
    items: [], // Prázdný seznam položek
  };

  shoppingLists.push(newShoppingList); // Přidat do seznamu
  res.json({
    ...newShoppingList,
    uuAppErrorMap: {}, // Chyby budou zde, pokud nějaké nastanou
  });
});


router.delete("/delete/:id", checkRole("owner"), (req, res) => {
  const shoppingListId = req.params.id;

  const index = shoppingLists.findIndex((list) => list.id === shoppingListId);
  if (index === -1) {
    return res.status(404).json({
      error: "Shopping list not found",
      uuAppErrorMap: {},
    });
  }

  shoppingLists.splice(index, 1); // Odebrat seznam
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

  const shoppingList = shoppingLists.find((list) => list.id === shoppingListId);
  if (!shoppingList) {
    return res.status(404).json({
      error: "Shopping list not found",
      uuAppErrorMap: {},
    });
  }

  const newItem = {
    id: `${Date.now()}`, // Unikátní ID položky
    name: itemName,
    quantity,
    unit,
    addedAt: new Date().toISOString(),
  };

  shoppingList.items.push(newItem); // Přidat položku do seznamu
  res.json({
    shoppingListId,
    ...newItem,
    uuAppErrorMap: {},
  });
});


// DELETE /shopping-list/:id/remove-item/:itemId
router.delete("/:id/remove-item/:itemId", checkRole(["owner", "member"]), (req, res) => {
  const shoppingListId = req.params.id;
  const itemId = req.params.itemId;

  const shoppingList = shoppingLists.find((list) => list.id === shoppingListId);
  if (!shoppingList) {
    return res.status(404).json({
      error: "Shopping list not found",
      uuAppErrorMap: {},
    });
  }

  const itemIndex = shoppingList.items.findIndex((item) => item.id === itemId);
  if (itemIndex === -1) {
    return res.status(404).json({
      error: "Item not found",
      uuAppErrorMap: {},
    });
  }

  shoppingList.items.splice(itemIndex, 1); // Odebrat položku
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
    shoppingLists, // Vracíme všechny seznamy
    uuAppErrorMap: {},
  });
});


// PUT /shopping-list/:id/mark-item/:itemId
router.put("/:id/mark-item/:itemId", checkRole(["owner", "member"]), validate(markItemSchema), (req, res) => {
  const shoppingListId = req.params.id;
  const itemId = req.params.itemId;
  const { isCompleted } = req.body;

  const shoppingList = shoppingLists.find((list) => list.id === shoppingListId);
  if (!shoppingList) {
    return res.status(404).json({
      error: "Shopping list not found",
      uuAppErrorMap: {},
    });
  }

  const item = shoppingList.items.find((item) => item.id === itemId);
  if (!item) {
    return res.status(404).json({
      error: "Item not found",
      uuAppErrorMap: {},
    });
  }

  item.isCompleted = isCompleted; // Označit položku
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

  const shoppingList = shoppingLists.find((list) => list.id === shoppingListId);
  if (!shoppingList) {
    return res.status(404).json({
      error: "Shopping list not found",
      uuAppErrorMap: {},
    });
  }

  if (!shoppingList.members) shoppingList.members = []; // Přidat pole pro členy, pokud neexistuje
  shoppingList.members.push(email); // Přidat e-mail

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

  const shoppingList = shoppingLists.find((list) => list.id === shoppingListId);
  if (!shoppingList) {
    return res.status(404).json({
      error: "Shopping list not found",
      uuAppErrorMap: {},
    });
  }

  shoppingList.name = newName; // Změnit název seznamu
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

  const shoppingList = shoppingLists.find((list) => list.id === shoppingListId);
  if (!shoppingList) {
    return res.status(404).json({
      error: "Shopping list not found",
      uuAppErrorMap: {},
    });
  }

  shoppingList.status = "archived"; // Změnit status na archivovaný
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

  const shoppingList = shoppingLists.find((list) => list.id === shoppingListId);
  if (!shoppingList) {
    return res.status(404).json({
      error: "Shopping list not found",
      uuAppErrorMap: {},
    });
  }

  if (shoppingList.status !== "archived") {
    return res.status(400).json({
      error: "Shopping list is not archived",
      uuAppErrorMap: {},
    });
  }

  shoppingList.status = "active"; // Změnit status na aktivní
  res.json({
    shoppingListId,
    status: "restored",
    restoredAt: new Date().toISOString(),
    uuAppErrorMap: {},
  });
});


module.exports = router;


