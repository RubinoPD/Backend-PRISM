const mongoose = require("mongoose");
require("dotenv").config();

// Import models
const User = require("./models/user");
const StructuralUnit = require("./models/structuralUnit");
const Task = require("./models/task");

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected for seeding");
    seedDatabase();
  })
  .catch((err) => {
    console.error("MongoDB Connection Error:", err);
    process.exit(1);
  });

const seedDatabase = async () => {
  try {
    console.log("Starting database seeding...");

    // Clear existing data
    await User.deleteMany();
    await StructuralUnit.deleteMany();
    await Task.deleteMany();

    // Create default admin user (let the model handle password hashing)
    const adminUser = await User.create({
      username: "admin",
      password: "admin123",
      role: "admin",
    });

    // Create default superuser (let the model handle password hashing)
    const superUser = await User.create({
      username: "superuser",
      password: "super123",
      role: "superuser",
    });

    console.log("✓ Default users created");

    // Create default structural units
    const defaultUnits = [
      { name: "RIS burys", parentUnit: "Rysiu ir informaciniu sistemu burys" },
      {
        name: "LAN/WAN skyrius",
        parentUnit: "Rysiu ir informaciniu sistemu burys",
      },
      {
        name: "Videotelekonferencijos skyrius",
        parentUnit: "Rysiu ir informaciniu sistemu burys",
      },
      {
        name: "Laidinio rysio skyrius",
        parentUnit: "Rysiu ir informaciniu sistemu burys",
      },
      {
        name: "Kompiuteriniui tinklu skyrius",
        parentUnit: "Rysiu ir informaciniu sistemu burys",
      },
      {
        name: "1 rysiu skyrius",
        parentUnit: "Rysiu ir informaciniu sistemu burys",
      },
      {
        name: "2 rysiu skyrius",
        parentUnit: "Rysiu ir informaciniu sistemu burys",
      },
      {
        name: "Vartotoju aptarnavimo skyrius",
        parentUnit: "Rysiu ir informaciniu sistemu burys",
      },
      // Add units for other primary units
      {
        name: "Paramos burys vienetas 1",
        parentUnit: "Paramos burys",
      },
      {
        name: "Paramos burys vienetas 2",
        parentUnit: "Paramos burys",
      },
      {
        name: "Valdymo grupe vienetas 1",
        parentUnit: "Valdymo grupe",
      },
    ];

    await StructuralUnit.insertMany(defaultUnits);
    console.log("✓ Default structural units created");

    // Create default tasks
    const defaultTasks = [
      {
        name: "Fizinio pasirengimo patikrinimas",
        description: "Metinis fizinio pasirengimo testas",
        type: "Individualios",
        createdBy: adminUser._id,
      },
      {
        name: "Saudymo mokymai",
        description: "Ginklu naudojimo ir saudymo mokymai",
        type: "Individualios",
        createdBy: adminUser._id,
      },
      {
        name: "Taktikos mokymai",
        description: "Taktiniu veiksmu mokymai",
        type: "Kolektyvines",
        createdBy: adminUser._id,
      },
      {
        name: "Rysiu sistemu mokymai",
        description: "Rysiu irenginio naudojimo mokymai",
        type: "Kolektyvines",
        createdBy: adminUser._id,
      },
      {
        name: "Pirmos pagalbos mokymai",
        description: "Medicininės pagalbos teikimo mokymai",
        type: "Individualios",
        createdBy: adminUser._id,
      },
      {
        name: "Kibernetinio saugumo mokymai",
        description: "Informaciniu sistemu saugumo mokymai",
        type: "Kolektyvines",
        createdBy: adminUser._id,
      },
    ];

    await Task.insertMany(defaultTasks);
    console.log("✓ Default tasks created");

    console.log("\n=== Seeding completed successfully! ===");
    console.log("\nDefault users created:");
    console.log("Admin - username: admin, password: admin123");
    console.log("Superuser - username: superuser, password: super123");
    console.log("\nIMPORTANT: Change these default passwords in production!");

    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};
