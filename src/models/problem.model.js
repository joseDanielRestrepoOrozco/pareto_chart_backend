import mongoose from 'mongoose'

const problemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  frequency: { type: Number, required: true },
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true }
})

problemSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Problem = mongoose.model('Problem', problemSchema)

export default Problem
