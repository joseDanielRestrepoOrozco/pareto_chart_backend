import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  verificationCode: {
    type: String
  },
  verificationCodeExpires: {
    type: Date
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'PENDING', 'INACTIVE'],
    default: 'PENDING'
  },
  projects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }]
})

schema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v

    delete returnedObject.passwordHash
    delete returnedObject.verificationCode
    delete returnedObject.verificationCodeExpires
    delete returnedObject.status
    delete returnedObject.projects
  }
})

export default mongoose.model('User', schema)
