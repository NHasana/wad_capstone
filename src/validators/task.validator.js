const Joi = require("joi");

const createTaskSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().allow(""),
  status: Joi.string()
    .valid("todo", "in_progress", "done")
    .default("todo"),
  priority: Joi.string()
    .valid("low", "medium", "high")
    .default("medium"),
});

const replaceTaskSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().allow(""),
  status: Joi.string()
    .valid("todo", "in_progress", "done")
    .required(),
  priority: Joi.string()
    .valid("low", "medium", "high")
    .required(),
});

const updateTaskSchema = Joi.object({
  title: Joi.string(),
  description: Joi.string().allow(""),
  status: Joi.string().valid("todo", "in_progress", "done"),
  priority: Joi.string().valid("low", "medium", "high"),
}).min(1);

const listTasksSchema = Joi.object({
  status: Joi.string().valid("todo", "in_progress", "done"),
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