const request = require("supertest");
const app = require("../src/app");

describe("Shopping List Endpoints", () => {
  // POST /shopping-list/create
  describe("POST /shopping-list/create", () => {
    it("should create a new shopping list (happy day)", async () => {
      const res = await request(app)
        .post("/shopping-list/create")
        .set("role", "owner") // Přidání role
        .send({ name: "Groceries", description: "Weekly shopping" });
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("id");
      expect(res.body.name).toBe("Groceries");
    });

    it("should return 400 if name is missing", async () => {
      const res = await request(app)
        .post("/shopping-list/create")
        .set("role", "owner") // Přidání role
        .send({ description: "Weekly shopping" });
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("uuAppErrorMap.validationError"); // Opravené očekávání
    });
  });

  // DELETE /shopping-list/delete/:id
  describe("DELETE /shopping-list/delete/:id", () => {
    it("should delete a shopping list (happy day)", async () => {
      const resCreate = await request(app)
        .post("/shopping-list/create")
        .set("role", "owner") // Přidání role
        .send({ name: "Temporary List" });
      const id = resCreate.body.id;

      const resDelete = await request(app)
        .delete(`/shopping-list/delete/${id}`)
        .set("role", "owner") // Přidání role
        .send();
      expect(resDelete.statusCode).toBe(200);
      expect(resDelete.body).toHaveProperty("status", "deleted");
    });

    it("should return 404 if shopping list does not exist", async () => {
      const res = await request(app)
        .delete("/shopping-list/delete/nonexistent-id")
        .set("role", "owner") // Přidání role
        .send();
      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty("error", "Shopping list not found");
    });
  });

  // POST /shopping-list/:id/add-item
  describe("POST /shopping-list/:id/add-item", () => {
    it("should add an item to the shopping list (happy day)", async () => {
      const resCreate = await request(app)
        .post("/shopping-list/create")
        .set("role", "owner") // Přidání role
        .send({ name: "Groceries" });
      const id = resCreate.body.id;

      const resAddItem = await request(app)
        .post(`/shopping-list/${id}/add-item`)
        .set("role", "owner") // Přidání role
        .send({ itemName: "Milk", quantity: 2, unit: "liters" });
      expect(resAddItem.statusCode).toBe(200);
      expect(resAddItem.body).toHaveProperty("name", "Milk");
    });

    it("should return 404 if shopping list does not exist", async () => {
      const res = await request(app)
        .post("/shopping-list/nonexistent-id/add-item")
        .set("role", "owner") // Přidání role
        .send({ itemName: "Milk", quantity: 2, unit: "liters" });
      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty("error", "Shopping list not found");
    });
  });

  // DELETE /shopping-list/:id/remove-item/:itemId
  describe("DELETE /shopping-list/:id/remove-item/:itemId", () => {
    it("should remove an item from the shopping list (happy day)", async () => {
      const resCreate = await request(app)
        .post("/shopping-list/create")
        .set("role", "owner") // Přidání role
        .send({ name: "Groceries" });
      const listId = resCreate.body.id;

      const resAddItem = await request(app)
        .post(`/shopping-list/${listId}/add-item`)
        .set("role", "owner") // Přidání role
        .send({ itemName: "Milk", quantity: 2, unit: "liters" });
      const itemId = resAddItem.body.id;

      const resRemoveItem = await request(app)
        .delete(`/shopping-list/${listId}/remove-item/${itemId}`)
        .set("role", "owner") // Přidání role
        .send();
      expect(resRemoveItem.statusCode).toBe(200);
      expect(resRemoveItem.body).toHaveProperty("removedItemId", itemId);
    });

    it("should return 404 if item does not exist", async () => {
      const resCreate = await request(app)
        .post("/shopping-list/create")
        .set("role", "owner") // Přidání role
        .send({ name: "Groceries" });
      const listId = resCreate.body.id;

      const res = await request(app)
        .delete(`/shopping-list/${listId}/remove-item/nonexistent-item`)
        .set("role", "owner") // Přidání role
        .send();
      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty("error", "Item not found");
    });
  });

  // GET /shopping-list/accessible
  describe("GET /shopping-list/accessible", () => {
    it("should return all accessible shopping lists", async () => {
      const res = await request(app)
        .get("/shopping-list/accessible")
        .set("role", "owner") // Přidání role
        .send();
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("shoppingLists");
      expect(Array.isArray(res.body.shoppingLists)).toBeTruthy();
    });
  });

  // PUT /shopping-list/:id/mark-item/:itemId
  describe("PUT /shopping-list/:id/mark-item/:itemId", () => {
    it("should mark an item as completed (happy day)", async () => {
      const resCreate = await request(app)
        .post("/shopping-list/create")
        .set("role", "owner") // Přidání role
        .send({ name: "Groceries" });
      const listId = resCreate.body.id;

      const resAddItem = await request(app)
        .post(`/shopping-list/${listId}/add-item`)
        .set("role", "owner") // Přidání role
        .send({ itemName: "Milk", quantity: 2, unit: "liters" });
      const itemId = resAddItem.body.id;

      const resMarkItem = await request(app)
        .put(`/shopping-list/${listId}/mark-item/${itemId}`)
        .set("role", "owner") // Přidání role
        .send({ isCompleted: true });
      expect(resMarkItem.statusCode).toBe(200);
      expect(resMarkItem.body).toHaveProperty("isCompleted", true);
    });

    it("should return 404 if item does not exist", async () => {
      const resCreate = await request(app)
        .post("/shopping-list/create")
        .set("role", "owner") // Přidání role
        .send({ name: "Groceries" });
      const listId = resCreate.body.id;

      const res = await request(app)
        .put(`/shopping-list/${listId}/mark-item/nonexistent-item`)
        .set("role", "owner") // Přidání role
        .send({ isCompleted: true });
      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty("error", "Item not found");
    });
  });

  // POST /shopping-list/:id/invite
  describe("POST /shopping-list/:id/invite", () => {
    it("should invite a member to the shopping list (happy day)", async () => {
      const resCreate = await request(app)
        .post("/shopping-list/create")
        .set("role", "owner") // Přidání role
        .send({ name: "Groceries" });
      const listId = resCreate.body.id;

      const resInvite = await request(app)
        .post(`/shopping-list/${listId}/invite`)
        .set("role", "owner") // Přidání role
        .send({ email: "test@example.com" });
      expect(resInvite.statusCode).toBe(200);
      expect(resInvite.body).toHaveProperty("invitedEmail", "test@example.com");
    });

    it("should return 404 if shopping list does not exist", async () => {
      const res = await request(app)
        .post("/shopping-list/nonexistent-id/invite")
        .set("role", "owner") // Přidání role
        .send({ email: "test@example.com" });
      expect(res.statusCode).toBe(404);
    });
  });

  // PUT /shopping-list/:id/rename
  describe("PUT /shopping-list/:id/rename", () => {
    it("should rename a shopping list (happy day)", async () => {
      const resCreate = await request(app)
        .post("/shopping-list/create")
        .set("role", "owner") // Přidání role
        .send({ name: "Groceries" });
      const listId = resCreate.body.id;

      const resRename = await request(app)
        .put(`/shopping-list/${listId}/rename`)
        .set("role", "owner") // Přidání role
        .send({ newName: "Weekly Groceries" });
      expect(resRename.statusCode).toBe(200);
      expect(resRename.body).toHaveProperty("newName", "Weekly Groceries");
    });

    it("should return 404 if shopping list does not exist", async () => {
      const res = await request(app)
        .put("/shopping-list/nonexistent-id/rename")
        .set("role", "owner") // Přidání role
        .send({ newName: "Weekly Groceries" });
      expect(res.statusCode).toBe(404);
    });
  });
});
