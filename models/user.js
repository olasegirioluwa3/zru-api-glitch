import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    default: '',
  },
  lastName: {
    type: String,
    required: true,
    default: '',
  },
  middleName: {
    type: String,
    default: '',
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function(v) {
        return /\S+@\S+\.\S+/.test(v);
      },
      message: props => `${props.value} is not a valid email!`,
    },
  },
  username: {
    type: String,
    unique: true,
    default: '',
  },
  gender: {
    type: String,
    default: '',
  },
  emailVerificationToken: {
    type: String,
    required: false,
    default: '',
  },
  emailVerificationStatus: {
    type: String,
    enum: ['pending', 'activated', 'blocked'],
    default: 'pending',
  },
  emailVerificationExpires: {
    type: Date,
    required: false,
    default: Date.now,
  },
  password: {
    type: String,
    required: true,
  },
  resetPasswordToken: {
    type: String,
    default: '',
  },
  resetPasswordExpires: {
    type: Date,
    default: null,
  },
  accountStatus: {
    type: String,
    enum: ['pending', 'in-review', 'active', 'blocked'],
    default: 'active',
  },
  profilePicture: {
    type: String,
    default: '',
  },
  coverPicture: {
    type: String,
    default: '',
  },
  dateOfBirth: {
    type: Date,
    validate: {
      validator: function(v) {
        return v instanceof Date && !isNaN(v);
      },
      message: props => `${props.value} is not a valid date of birth!`,
    },
  },
  phoneNumber: {
    type: String,
    default: '',
  },
  address: {
    type: String,
    default: '',
  },
  country: {
    type: String,
    default: '',
  },
  state: {
    type: String,
    default: '',
  },
  city: {
    type: String,
    default: '',
  },
  localGovernment: {
    type: String,
    default: '',
  },
  zipCode: {
    type: String,
    default: '',
  },
  regCenterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RegCenter',
    default: null,
  },
}, {
  timestamps: true,
});

userSchema.statics.emailExist = async function(email) {
  const user = await this.findOne({ email });
  return !!user;
};

const User = mongoose.model('User', userSchema);

export default User;
