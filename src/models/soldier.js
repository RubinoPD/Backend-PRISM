const mongoose = require('mongoose');

const soldierSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  militaryRank: {
    type: String,
    required: true,
    trim: true,
  },
  joinDate: {
    type: Date,
    required: true,
  },
  primaryUnit: {
    type: String,
    required: true,
    enum: [
      'Paramos burys',
      'Rysiu ir informaciniu sistemu burys',
      'Valdymo grupe',
    ],
  },
  subUnit: {
    type: String,
    required: function () {
      return (
        this.isNew &&
        [
          'Rysiu ir informaciniu sistemu burys',
          'Paramos burys',
          'Valdymo grupe',
        ].includes(this.primaryUnit)
      );
    },
    enum: [
      // RIS units
      'RIS burys',
      'LAN/WAN skyrius',
      'Videotelekonferencijos skyrius',
      'Laidinio rysio skyrius',
      'Kompiuteriniui tinklu skyrius',
      '1 rysiu skyrius',
      '2 rysiu skyrius',
      'Vartotoju aptarnavimo skyrius',

      // Paramos burys
      'Generatoriu technikas',
      'Elektros technikas',
      'Automobiliu technikas',
      'Materialiniu daiktu technikas',
      'Burio vadas',

      //Valdymo grupe
      'Administratorius(-e)',
      'Kuopininkas',
      'Kuopos vadas',
      'Kuopos vado pavaduotojas(-e)',
    ],
  },
  active: {
    type: Boolean,
    default: true,
  },
});

// Add custom validation for updates
soldierSchema.pre('save', function (next) {
  const unitsRequiringSubUnits = [
    'Rysiu ir informaciniu sistemu burys',
    'Paramos burys',
    'Valdymo grupe',
  ];

  if (
    this.isNew &&
    this.primaryUnit === unitsRequiringSubUnits.includes(this.primaryUnit) &&
    !this.subUnit
  ) {
    return next(
      new Error(
        `Sub-unit is required when primary unit is "${this.primaryUnit}"`
      )
    );
  }

  next();
});

soldierSchema.index({ lastName: 1, firstName: 1 }); // For name searches
soldierSchema.index({ primaryUnit: 1 }); // For unit filtering
soldierSchema.index({ active: 1 }); // For active/inactive filtering

module.exports = mongoose.model('Soldier', soldierSchema);
