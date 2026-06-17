const Joi = require("joi");

const create = Joi.object({
  title: Joi.string().required().messages({
    "string.empty": "Judul tidak boleh kosong",
    "any.required": "Judul wajib diisi"
  }),
  message: Joi.string().required().messages({
    "string.empty": "Pesan tidak boleh kosong",
    "any.required": "Pesan wajib diisi"
  }),
  type: Joi.string().valid("INFO", "WARNING", "SUCCESS").required().messages({
    "any.only": "Tipe harus berupa salah satu dari INFO, WARNING, atau SUCCESS",
    "any.required": "Tipe notifikasi wajib diisi"
  }),
  userId: Joi.number().integer().required().messages({
    "number.base": "User ID harus berupa angka",
    "any.required": "User ID wajib disertakan"
  }),
  relatedTaskId: Joi.number().integer().optional().allow(null)
});

const update = Joi.object({
  title: Joi.string().optional(),
  message: Joi.string().optional(),
  type: Joi.string().valid("INFO", "WARNING", "SUCCESS").optional().messages({
    "any.only": "Tipe harus berupa salah satu dari INFO, WARNING, atau SUCCESS"
  }),
  isRead: Joi.boolean().optional().messages({
    "boolean.base": "Status membaca (isRead) harus bernilai true atau false"
  })
});

module.exports = {
  create,
  update
};