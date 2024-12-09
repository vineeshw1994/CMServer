

export const loginAuthentication =async(req,res)=>{
    try {
        const { email, password, role } = req.body;

        // Step 1: Validate empty fields
        if (!email || !password || !role) {
          return res.status(400).json({ error: 'All fields are required.' });
        }
      
        
          // Step 2: Check if the user exists
          const user = await User.findOne({ email });
      
          if (!user) {
            return res.status(400).json({ error: 'Invalid credentials: Email does not exist.' });
          }
      
          // Step 3: Validate the password
          const isPasswordValid = await bcrypt.compare(password, user.password);
          if (!isPasswordValid) {
            return res.status(400).json({ error: 'Invalid credentials: Incorrect password.' });
          }
      
          // Step 4: Validate the role
          if (user.role !== role) {
            return res.status(400).json({ error: 'Invalid credentials: Incorrect role.' });
          }
      
          // Step 5: Generate JWT Token
          const payload = {
            user: {
              id: user.id,
              role: user.role,
            },
          };
      
          const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
      
          // Send the JWT Token as a cookie
          res.cookie("accessToken", token, {
            httpOnly: true, // Secure cookie
            secure: true,   // Use only HTTPS
            sameSite: "None", // Required for cross-origin requests
            maxAge: 24 * 60 * 60 * 1000, // 1 day
          });
      
          // Respond with the user and token
          return res.status(200).json({
            token,
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            },
          });
        
    } catch (error) {
        console.error('Error In login:', error);
        res.status(500).json({ error: 'Failed to Login' });
        
    }
}
import User from "../../models/userModel.js";
import bcrypt from 'bcryptjs';
import { generateOtp, sendOtpEmail } from "../../utils/otp.js";



export const signupUser = async (req, res) => {
    try {
      const { firstName, email, mobile, password, role } = req.body;
  console.log('req.body',req.body);
  
      // Validate input
      if (!firstName || !email || !mobile || !password || !role) {
        return res.status(400).json({ message: 'All fields are required' });
      }
  
      // Check if the email already exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email is already taken' });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
      const otp = generateOtp();
console.log('genersted otp',otp);

      // Create a new user
      const newUser = await User.create({
        name: firstName,  // We're using `firstName` here since `lastName` is removed
        email,
        password: hashedPassword,
        role,
        phoneNumber: mobile,
        otp,
      });
      await sendOtpEmail(email, "Verify Your Account", `Your OTP is: ${otp}`);

      return res.status(201).json({ message: 'User registered successfully', user: newUser,userId: newUser.id });
    } catch (error) {
      console.error('Signup error:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  };
  export const verifyOtp = async (req, res) => {
    try {
      const { userId, otp } = req.body;
  
      console.log('Received OTP verification:', { userId, otp });
  
      // Validate input
      if (!userId || !otp) {
        return res.status(400).json({ message: 'User ID and OTP are required' });
      }
  
      // Ensure userId is treated as a number
      const user = await User.findOne({ where: { id: Number(userId) } });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Log user and OTP for debugging
      console.log('User found:', user);
      console.log('Comparing OTP:', otp, '==', user.otp);
  
      // Check if the OTP matches
      if (String(user.otp) !== String(otp)) {
        return res.status(400).json({ message: 'Invalid OTP' });
      }
  
      // Mark the user as verified
      user.isVerified = true;
      user.otp = null;
      await user.save();
  
      return res.status(200).json({ message: 'OTP verified successfully' });
    } catch (error) {
      console.error('OTP verification error:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  };
  
