import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    default: ''
  },
  lastName: {
    type: String,
    required: true,
    default: ''
  },
  middleName: {
    type: String,
    default: ''
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (v) {
        return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$/.test(v);
      },
      message: 'Invalid email format!'
    }
  },
  username: {
    type: String,
    unique: true,
    default: ''
  },
  gender: {
    type: String,
    default: ''
  },
  emailVerificationToken: {
    type: String,
    required: false,
    default: ''
  },
  emailVerificationStatus: {
    type: String,
    enum: ['pending', 'activated', 'blocked'],
    default: 'pending'
  },
  emailVerificationExpires: {
    type: String,
    required: false,
    default: ''
  },
  password: {
    type: String,
    required: true
  },
  resetPasswordToken: {
    type: String,
    default: ''
  },
  resetPasswordExpires: {
    type: String,
    default: ''
  },
  accountStatus: {
    type: String,
    enum: ['pending', 'in-review', 'active', 'blocked'],
    default: 'active',
  },
  profilePicture: {
    type: String,
    default: ''
  },
  coverPicture: {
    type: String,
    default: ''
  },
  dateOfBirth: {
    type: Date,
    validate: {
      validator: function (v) {
        return !isNaN(Date.parse(v));
      },
      message: 'Invalid date format!'
    }
  },
  phoneNumber: {
    type: String,
    default: ''
  },
  address: {
    type: String,
    default: ''
  },
  country: {
    type: String,
    default: ''
  },
  state: {
    type: String,
    default: ''
  },
  city: {
    type: String,
    default: ''
  },
  localGovernment: {
    type: String,
    default: ''
  },
  zipCode: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    enum: ['admin', 'server', 'rumble'],
    default: 'admin'
  }
}, {
  timestamps: true
});

adminSchema.statics.emailExist = async function (email) {
  const admin = await this.findOne({ email });
  return !!admin;
};

const Admin = mongoose.model('Admin', adminSchema);

export default Admin;
