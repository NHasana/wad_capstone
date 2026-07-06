const Joi = require("joi");
const createTaskSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().allow(""),
  status: Joi.string()
    .valid("TODO", "IN_PROGRESS", "DONE")
    .default("TODO"),
  priority: Joi.string()
    .valid("LOW", "MEDIUM", "HIGH")
    .default("MEDIUM"),
});
const replaceTaskSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().allow(""),
  status: Joi.string()
    .valid("TODO", "IN_PROGRESS", "DONE")
    .required(),
  priority: Joi.string()
    .valid("LOW", "MEDIUM", "HIGH")
    .required(),
});
const updateTaskSchema = Joi.object({
  title: Joi.string(),
  description: Joi.string().allow(""),
  status: Joi.string().valid("TODO", "IN_PROGRESS", "DONE"),
  priority: Joi.string().valid("LOW", "MEDIUM", "HIGH"),
}).min(1);
const listTasksSchema = Joi.object({
  status: Joi.string().valid("TODO", "IN_PROGRESS", "DONE"),
  limit: Joi.number().integer().min(1).default(10),
  offset: Joi.number().integer().min(0).default(0),
  sort: Joi.string().valid(
    "id",
    "title",
    "status",
    "priority",
    "createdAt"
  ),
  order: Joi.string().valid("asc", "desc"),
});
module.exports = {
  createTaskSchema,
  replaceTaskSchema,
  updateTaskSchema,
  listTasksSchema,
};
