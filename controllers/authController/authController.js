

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