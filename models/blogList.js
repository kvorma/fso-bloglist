// FullStackOpen - harjoitustyö
// Mongoosen käyttöön liittyvät rutiinitxs
// (c) 2025 Kai Vorma

const mongoose = require('mongoose')

const blogSchema = mongoose.Schema({
  title: { type: String, required: true, maxlength: 100 },
  author: { type: String, required: true, maxlength: 100 },
  url: { type: String, required: true, maxlength: 100 },
  likes: { type: Number, min: 0, default: 0 },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  comments: [{ type: String, required: true, maxlength: 100 }],
})

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('Blog', blogSchema)
