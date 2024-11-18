const Joi = require("joi");


const createShoppingListSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().optional(),
});


const deleteShoppingListSchema = Joi.object({
  id: Joi.string().required(),
});


const addItemSchema = Joi.object({
  itemName: Joi.string().required(),
  quantity: Joi.number().required(),
  unit: Joi.string().required(),
});


const markItemSchema = Joi.object({
  isCompleted: Joi.boolean().required(),
});


const inviteMemberSchema = Joi.object({
  email: Joi.string().email().required(),
});


const renameShoppingListSchema = Joi.object({
  newName: Joi.string().required(),
});


const archiveOrRestoreSchema = Joi.object({
  id: Joi.string().required(),
});


module.exports = {
  createShoppingListSchema,
  deleteShoppingListSchema,
  addItemSchema,
  markItemSchema,
  inviteMemberSchema,
  renameShoppingListSchema,
  archiveOrRestoreSchema, 
};
