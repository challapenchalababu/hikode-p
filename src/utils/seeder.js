const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

// Load env vars
dotenv.config();

// Load models
const User = require('../models/User');
const Role = require('../models/Role');
const Permission = require('../models/Permission');

// Connect to DB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Create default permissions
const createPermissions = async () => {
  try {
    // Remove existing permissions
    await Permission.deleteMany();

    console.log('Creating permissions...');

    // Define system resources
    const resources = [
      'users',
      'roles',
      'permissions'
    ];

    // Create permissions for each resource
    for (const resource of resources) {
      await Permission.create({
        resource,
        description: `Permissions for ${resource}`,
        actions: ['create', 'read', 'update', 'delete', 'list'],
        isSystem: true
      });
      console.log(`Created permission for ${resource}`);
    }

    console.log('Permissions created successfully');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

// Create default roles
const createRoles = async () => {
  try {
    // Remove existing roles
    await Role.deleteMany();

    console.log('Creating roles...');

    // Get all permissions
    const permissions = await Permission.find();

    // Create superadmin role with all permissions
    const superadminRole = await Role.create({
      name: 'superadmin',
      description: 'Super Administrator with all permissions',
      permissions: permissions.map(p => p._id),
      isDefault: false,
      isSystemRole: true
    });
    console.log('Created superadmin role');

    // Create admin role with all permissions except role management
    const adminPermissions = permissions.filter(p => p.resource !== 'roles' && p.resource !== 'permissions');
    const adminRole = await Role.create({
      name: 'admin',
      description: 'Administrator with limited permissions',
      permissions: adminPermissions.map(p => p._id),
      isDefault: false,
      isSystemRole: true
    });
    console.log('Created admin role');

    // Create default user role with minimal permissions
    const userPermissions = permissions.filter(p => 
      (p.resource === 'users' && ['read', 'update'].includes(p.actions[0]))
    );
    const userRole = await Role.create({
      name: 'user',
      description: 'Regular user with minimal permissions',
      permissions: userPermissions.map(p => p._id),
      isDefault: true,
      isSystemRole: true
    });
    console.log('Created user role');

    return { superadminRole, adminRole, userRole };
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

// Create default users
const createUsers = async (roles) => {
  try {
    // Remove existing users
    await User.deleteMany();

    console.log('Creating users...');

    // Create superadmin user
    await User.create({
      firstName: 'Super',
      lastName: 'Admin',
      email: 'superadmin@example.com',
      password: 'password123',
      role: roles.superadminRole._id,
      active: true
    });
    console.log('Created superadmin user');

    // Create admin user
    await User.create({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@example.com',
      password: 'password123',
      role: roles.adminRole._id,
      active: true
    });
    console.log('Created admin user');

    // Create regular user
    await User.create({
      firstName: 'Regular',
      lastName: 'User',
      email: 'user@example.com',
      password: 'password123',
      role: roles.userRole._id,
      active: true
    });
    console.log('Created regular user');

    console.log('Users created successfully');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

// Run the seeder
const runSeeder = async () => {
  try {
    await createPermissions();
    const roles = await createRoles();
    await createUsers(roles);

    console.log('Seeding completed successfully');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

runSeeder(); 