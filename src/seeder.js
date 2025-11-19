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

    // Clear existing data (optional - comment out if you want to keep existing data)
    // await User.deleteMany();
    // await StructuralUnit.deleteMany();
    // await Task.deleteMany();

    // Create default users (skip if they already exist)
    let adminUser = await User.findOne({ username: "admin" });
    if (!adminUser) {
      adminUser = await User.create({
        username: "admin",
        password: "admin123",
        role: "admin",
      });
      console.log("✓ Admin user created");
    }

    const existingSuperuser = await User.findOne({ username: "superuser" });
    if (!existingSuperuser) {
      await User.create({
        username: "superuser",
        password: "super123",
        role: "superuser",
      });
      console.log("✓ Superuser created");
    }

    // Create/update structural units
    const defaultUnits = [
      // Existing RIS units
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

      // NEW: Paramos burys sub-units
      { name: "Generatoriu technikas", parentUnit: "Paramos burys" },
      { name: "Elektros technikas", parentUnit: "Paramos burys" },
      { name: "Automobiliu technikas", parentUnit: "Paramos burys" },
      { name: "Materialiniu daiktu technikas", parentUnit: "Paramos burys" },
      { name: "Burio vadas", parentUnit: "Paramos burys" },

      // NEW: Valdymo grupe sub-units
      { name: "Administratorius(-e)", parentUnit: "Valdymo grupe" },
      { name: "Kuopininkas", parentUnit: "Valdymo grupe" },
      { name: "Kuopos vadas", parentUnit: "Valdymo grupe" },
      { name: "Kuopos vado pavaduotojas", parentUnit: "Valdymo grupe" },
    ];

    // Insert only new units (avoid duplicates)
    for (const unit of defaultUnits) {
      const exists = await StructuralUnit.findOne({ name: unit.name });
      if (!exists) {
        await StructuralUnit.create(unit);
        console.log(`✓ Created structural unit: ${unit.name}`);
      }
    }

    console.log("✓ Structural units processed");

    // Create sample tasks if none exist
    const existingTasks = await Task.countDocuments();
    if (existingTasks === 0) {
      const sampleTasks = [
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
          name: "Technikos prieziura",
          description: "Irangos ir technikos prieziuros mokymai",
          type: "Individualios",
          createdBy: adminUser._id,
        },
      ];

      await Task.insertMany(sampleTasks);
      console.log("✓ Sample tasks created");
    }

    console.log("🎉 Database seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};
