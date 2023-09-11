const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { hash, compare } = bcrypt;

const moveFunds = require('./service.cjs');
const validateTransaction = require('./service.cjs');

// Define your validateTransaction function here

module.exports = (app) => {
// Register a user
app.post('/register', async (req, res) => {
    try {
      const { username, password } = req.body;
  
      // Check if the user already exists
      const existingUser = await User.findOne({ username });
      if (existingUser) {
          return res.status(409).json({ message: 'User already exists' });
        }
    
        // Hash the password
        const hashedPassword = await hash(password, 10);
    
        // Create a new user
        const newUser = new User({
          username,
          password: hashedPassword,
        });
    
        await newUser.save();
    
        res.status(201).json({ message: 'User registered successfully' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
      }
    });

   // Login a user
   app.post('/login', async (req,res) => {
    try {
      const { username, password } = req.body;
  
      // Find the user
      const user = await User.findOne({ username });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Compare the password
      const isPasswordValid = await compare(password, user.password);
  
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid password' });
      }
  
      // Generate a JWT token
      const token = sign({ userId: user._id }, 'your-secret-key');
  
      res.status(200).json({ token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });


  // API endpoint to initiate a transaction
  app.post('/transaction', (req, res) => {
    const { amount, destinationWalletID, pin, otp } = req.body;
  
    if (validateTransaction(amount, destinationWalletID, pin,otp)) {
      // Move funds (implement this function)
      moveFunds(amount, destinationWalletID);
  
      // Create a transaction log
      const transactionLog = {timestamp: new Date(),
          amount,
          destinationWalletID,
        };
    
        transactionLog.push(transactionLog);
    
        res.status(200).json({ message: 'Transaction successful' });
      } else {
        res.status(400).json({ message: 'Invalid transaction parameters' });
      }
    });
    
    // Endpoint to retrieve transaction logs
    app.get('/transaction-logs', (req, res) => {
      res.status(200).json(transactionLogs);
  });
  
  function validateTransaction(transaction) {
    // Check if the amount is a positive number
    if (typeof transaction.amount !== 'number' || transaction.amount <= 0) {
      return false;
    }
  
    // Check if the destinationWalletID is a valid format (e.g., 12-character agent ID)
    if (typeof transaction.destinationWalletID !== 'string' || transaction.destinationWalletID.length !== 12) {
        return false;
      }
    
      // Check if the PIN is a 4-digit number
      if (!/^\d{4}$/.test(transaction.pin)) {
        return false;
      }
    
      // You can add more specific validation here if needed
    
      return true; // All validation checks passed
    }
};
