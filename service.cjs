const users = {};

class User {
  constructor(id, username, pin) {
    this.id = id;
    this.username = username;
    this.pin = pin;
    this.balance = 0; // Initial balance is 0
  }

  deposit(amount) {
    if (amount <= 0) {
      throw new Error('Invalid deposit amount');
    }
    this.balance += amount;
  }

  withdraw(amount) {
    if (amount <= 0 || amount > this.balance) {
      throw new Error('Invalid withdrawal amount or insufficient balance');
    }
    this.balance -= amount;
  }

  getBalance() {
    return this.balance;
  }
}

// Helper function to create a new user
function createUser(id, username, pin) {
  if (users[id]) {
    throw new Error('User already exists');
  }
  const newUser = new User(id, username, pin);
  users[id] = newUser;
  return newUser;
}

// Function to move funds between user accounts
function moveFunds(sender, receiver, amount) {
  if (!users[sender] || !users[receiver]) {
    throw new Error('Invalid sender or receiver');
  }

  try {
    users[sender].withdraw(amount); // Withdraw from sender
    users[receiver].deposit(amount); // Deposit to receiver
    return true; // Funds transferred successfully
  } catch (error) {
    // Handle validation errors or insufficient balance
    return false; // Funds transfer failed
  }
}

// Example usage
const user1 = createUser('user123', 'john_doe', '1234');
const user2 = createUser('user456', 'jane_doe', '5678');

user1.deposit(1000); // User1 deposits 1000 units
console.log('User1 balance:', user1.getBalance());

user2.deposit(500); // User2 deposits 500 units
console.log('User2 balance:', user2.getBalance());

const transferAmount = 200;
if (moveFunds('user123', 'user456', transferAmount)) {
  console.log(`Transfer of ${transferAmount} units successful`);
} else {
  console.log('Transfer failed');
}

console.log('Updated User1 balance:', user1.getBalance());
console.log('Updated User2 balance:', user2.getBalance());
  

module.exports = moveFunds;