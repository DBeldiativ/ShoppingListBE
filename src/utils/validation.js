const Joi = require("joi");

// Validátor pro vytvoření nákupního seznamu
const createShoppingListSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().optional(),
});

// Validátor pro smazání nákupního seznamu
const deleteShoppingListSchema = Joi.object({
  id: Joi.string().required(),
});

// Validátor pro přidání položky do seznamu
const addItemSchema = Joi.object({
  itemName: Joi.string().required(),
  quantity: Joi.number().required(),
  unit: Joi.string().required(),
});

// Validátor pro označení položky jako dokončené/nedokončené
const markItemSchema = Joi.object({
  isCompleted: Joi.boolean().required(),
});

// Validátor pro pozvání člena
const inviteMemberSchema = Joi.object({
  email: Joi.string().email().required(),
});

// Validátor pro přejmenování seznamu
const renameShoppingListSchema = Joi.object({
  newName: Joi.string().required(),
});

// Validátor pro archivaci nebo obnovení seznamu
const archiveOrRestoreSchema = Joi.object({
  id: Joi.string().required(),
});

// Export všech validátorů
module.exports = {
  createShoppingListSchema,
  deleteShoppingListSchema,
  addItemSchema,
  markItemSchema,
  inviteMemberSchema,
  renameShoppingListSchema,
  archiveOrRestoreSchema, // Přidán zpět
};
