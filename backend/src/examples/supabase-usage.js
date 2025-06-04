const { getSupabase } = require('../lib/supabase');

/**
 * Example function to fetch all users from the database
 * @returns {Promise<Array>} Array of users
 */
async function getAllUsers() {
  try {
    const { data, error } = await getSupabase()
      .from('users')
      .select('*');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}

/**
 * Example function to fetch a user by ID
 * @param {string} userId - The ID of the user to fetch
 * @returns {Promise<Object|null>} User object or null if not found
 */
async function getUserById(userId) {
  try {
    const { data, error } = await getSupabase()
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
    return data || null;
  } catch (error) {
    console.error(`Error fetching user ${userId}:`, error);
    throw error;
  }
}

/**
 * Example function to create a new user
 * @param {Object} userData - User data to insert
 * @returns {Promise<Object>} The created user
 */
async function createUser(userData) {
  try {
    const { data, error } = await getSupabase()
      .from('users')
      .insert([userData])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

// Export the example functions
module.exports = {
  getAllUsers,
  getUserById,
  createUser
};

// Example usage (uncomment to test)
/*
async function testSupabase() {
  try {
    // Example: Create a new user
    const newUser = await createUser({
      email: 'test@example.com',
      name: 'Test User'
    });
    console.log('Created user:', newUser);

    // Example: Get all users
    const users = await getAllUsers();
    console.log('All users:', users);

    // Example: Get user by ID
    if (newUser) {
      const user = await getUserById(newUser.id);
      console.log('Fetched user:', user);
    }
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testSupabase();
*/
