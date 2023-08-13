const Schema = require('mongoose').Schema;

const MessageSchema = new Schema({
  content: {
    type: String,
    required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  timestamp: {
    type: Date,
    required: true,
  },
  parentId: {
    type: Schema.Types.ObjectId,
    ref: 'Message',
    default: null,
    required: true,
  },
  childId: {
    type: Schema.Types.ObjectId,
    ref: 'Message',
    default: null,
    required: true,
  },
});

module.exports = mongoose.model('Message', MessageSchema);
