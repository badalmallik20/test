const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName:{type: String, default:''},
  lastName:{type: String, default:''},
  email:{type: String, default:'',unique:true},
  mobileNumber: { type: String, default:'' },
}, {
    timestamps: true,
});

  userSchema.set('toObject');
  userSchema.set('toJSON');
module.exports = mongoose.model('Users', userSchema);


  