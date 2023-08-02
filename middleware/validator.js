const {check, validationResult}=require("express-validator");
const genres = require("../utils/genres");
const { isValidObjectId } = require("mongoose");

exports.userValidator= [
    check('name').trim().not().isEmpty().withMessage("Name is Missing !"),
    check('email').normalizeEmail().isEmail().withMessage("Email is Invalid!"),
    check('password').trim().not().isEmpty().withMessage("Password is Missing!").isLength({min: 8, max:20}).
    withMessage("Password must be between 8-20 character")
]

exports.validatePassword = [
    check('newPassword').trim().not().isEmpty().withMessage("Password is Missing!").isLength({min: 8, max:20}).
    withMessage("Password must be between 8-20 character")
]

exports.signInValidator=[
    check('email').normalizeEmail().isEmail().withMessage("Email is Invalid!"),
    check('password').trim().not().isEmpty().withMessage("Password is Missing!")
]

exports.actorInfoValidator = [
    check('name').trim().not().isEmpty().withMessage("Actor Name Missing"),
    check('about').trim().not().isEmpty().withMessage("Tell Me About Actor"),
    check('gender').trim().not().isEmpty().withMessage("Transgender?"),
];

exports.validateMovie = [
  check("title").trim().not().isEmpty().withMessage("Movie title is missing!"),
  check("storyLine")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Storyline is important!"),
  check("language").trim().not().isEmpty().withMessage("Language is missing!"),
  check("releaseDate").isDate().withMessage("Release date is missing!"),
  check("status")
    .isIn(["public", "private"])
    .withMessage("Movie status must be public or private!"),
   check("type").trim().not().isEmpty().withMessage("Movie type is missing!"),
  check("genres")
    .isArray()
    .withMessage("Genres must be an array of strings!")
    .custom((value) => {
      for (let g of value) {
        if (!genres.includes(g)) throw Error("Invalid genres!");
      }

      return true;
    }),
  check("tags")
    .isArray({ min: 1 })
    .withMessage("Tags must be an array of strings!")
    .custom((tags) => {
      for (let tag of tags) {
        if (typeof tag !== "string")
          throw Error("Tags must be an array of strings!");
      }

      return true;
    }),
  check("cast")
    .isArray()
    .withMessage("Cast must be an array of objects!")
    .custom((cast) => {
      for (let c of cast) {
        if (!isValidObjectId(c.actor))
          throw Error("Invalid cast id inside cast!");
        if (!c.roleAs?.trim()) throw Error("Role as is missing inside cast!");
        if (typeof c.leadActor !== "boolean")
          throw Error(
            "Only accepted boolean value inside leadActor inside cast!"
          );
      }

      return true;
    }),

];

exports.validateTrailer = check("trailer")
.isObject()
.withMessage("trailer must be an object with url and public_id")
.custom(({ url, public_id }) => {
  try {
    const result = new URL(url);
    if (!result.protocol.includes("http"))
      throw Error("Trailer url is invalid!");

    const arr = url.split("/");
    const publicId = arr[arr.length - 1].split(".")[0];

    if (public_id !== publicId)
      throw Error("Trailer public_id is invalid!");

    return true;
  } catch (error) {
    throw Error("Trailer url is invalid!");
  }
}),

  
exports.validate = (req, res, next) => {
    const error = validationResult(req).array();
    if (error.length) {
      return res.json({ error: error[0].msg });
    }
  
    next();
};

exports.validateRatings = check(
  "rating",
  "Rating must be a number between 0 and 10."
).isFloat({ min: 0, max: 10 });

