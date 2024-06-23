async function validateUserData( input ) {
  console.log(input);
  const { email, password, phoneNumber, firstName, middleName, lastName, username, gender, emailVerificationToken, resetPasswordToken, centerSlug, country, state, bankName, bankAccountNumber } = input;
  const errors = [];
  const data = {};

  if (email){
    if (!email || !email.trim()) {
      errors.push('Email is required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push('Invalid email format');
    } else {
      data.email = email;
    }
  }

  if (password) {
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^\w\s]).{8,}$/;
    if (!password || !password.trim()) {
      errors.push('Password is required');
    } else if (!passwordRegex.test(password)) {
      errors.push('Password must be at least 8 characters and include a mix of uppercase, lowercase letters, numbers, and special characters');
    } else {
      data.password = password;
    }
  }

  if (phoneNumber) {
    const sanitizedNumber = phoneNumber.replace(/\D/g, '');
    if (sanitizedNumber.length < 10) {
      errors.push('Phone number seems too short');
    } else if (sanitizedNumber.length > 15) {
      errors.push('Phone number seems too long');
    } else {
      data.phoneNumber = sanitizedNumber;
    }
  }

  if (firstName) {
    const namePattern = /^[a-zA-Z]+$/;
    if (!firstName || !firstName.trim()) {
      errors.push('Firstname is required');
    } else if (firstName.length < 2) {
      errors.push('Firstname must be at least 2 characters long');
    } else if (!firstName || !namePattern.test(firstName)) {
      errors.push('Firstname should only contain letters');
    } else {
      data.firstName = firstName;
    }
  }

  if (middleName) {
    const namePattern = /^[a-zA-Z]+$/;
    const middleNamePattern = /(?: [a-zA-Z]+)?(?: - [a-zA-Z]+)?$/;
    if (!middleName || !middleName.trim()) {
      errors.push('Middlename is required');
    } else if (middleName.length < 2) {
      errors.push('Middlename must be at least 2 characters long');
    } else if (!middleName || !namePattern.test(middleName)) {
      errors.push('Middlename should only contain letters');
    } else {
      data.middleName = middleName;
    }
  }
  
  if (lastName) {
    const namePattern = /^[a-zA-Z]+$/;
    if (!lastName || !lastName.trim()) {
      errors.push('Lastname is required');
    } else if (lastName.length < 2) {
      errors.push('Lastname must be at least 2 characters long');
    } else if (!lastName || !namePattern.test(lastName)) {
      errors.push('Lastname should only contain letters');
    } else {
      data.lastName = lastName;
    }
  }

  if (username) {
    // username = username.trim();
    if (!username) {
      errors.push('Username is required');
    } else if (username.length < 3) {
      errors.push('Username must be at least 3 characters long');
    } else if (username !== username.toLowerCase()) {
      errors.push('Username must be all lowercase');
    } else {
      data.username = username;
    }
  }

  if (gender){
    gender = gender.trim().toLowerCase();
    if (!gender) {
      errors.push('Gender is required');
    } else if (gender.length < 1) {
      errors.push('Gender must be at least 1 characters long');
    } else if (gender !== gender.toLowerCase()) {
      errors.push('Gender must be all lowercase');
    } else {
      data.gender = gender;
    }
  }

  if (emailVerificationToken) {
    // emailVerificationToken = emailVerificationToken.trim();
    if (!emailVerificationToken) {
      errors.push('emailVerificationToken is required');
    } else if (emailVerificationToken.length < 10) {
      errors.push('emailVerificationToken must be at least 10 characters long');
    } else {
      data.emailVerificationToken = emailVerificationToken;
    }
  }

  if (resetPasswordToken) {
    if (!resetPasswordToken) {
      errors.push('resetPasswordToken is required');
    } else if (resetPasswordToken.length < 10) {
      errors.push('resetPasswordToken must be at least 10 characters long');
    } else {
      data.resetPasswordToken = resetPasswordToken;
    }
  }

  if (centerSlug) {
    if (!centerSlug) {
      errors.push('Center Slug is required');
    } else if (centerSlug.length < 1) {
      errors.push('Center Slug must be at least 1 characters long');
    } else if (centerSlug !== centerSlug.toLowerCase()) {
      errors.push('Center Slug must be all lowercase');
    } else {
      data.centerSlug = centerSlug;
    }
  }

  if (country) {
    if (!country) {
      errors.push('Country is required');
    } else if (country.length < 1) {
      errors.push('Country must be at least 1 characters long');
    } else if (country !== country.toLowerCase()) {
      errors.push('Country must be all lowercase');
    } else {
      data.country = country;
    }
  }

  if (state) {
    if (!state) {
      errors.push('State is required');
    } else if (state.length < 1) {
      errors.push('State must be at least 1 characters long');
    } else if (state !== state.toLowerCase()) {
      errors.push('State must be all lowercase');
    } else {
      data.state = state;
    }
  }

  if (bankName) {
    if (!bankName) {
      errors.push('Bank Name is required');
    } else if (bankName.length < 1) {
      errors.push('Bank Name must be at least 1 characters long');
    } else if (bankName !== bankName.toLowerCase()) {
      errors.push('Bank Name must be all lowercase');
    } else {
      data.bankName = bankName;
    }
  }

  if (bankAccountNumber) {
    const sanitizedNumber = bankAccountNumber.replace(/\D/g, '');
    if (sanitizedNumber.length < 8) {
      errors.push('Bank Account Number seems too short');
    } else if (sanitizedNumber.length > 15) {
      errors.push('Bank Account Number seems too long');
    } else {
      data.bankAccountNumber = sanitizedNumber;
    }
  }

  console.log(data)
  console.log(errors);
  return { data, errors };
}

export default validateUserData;