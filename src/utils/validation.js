const validator = require("validator");

// Validation helper functions
const validateEmail = (email) => {
  return validator.isEmail(email);
};

const validatePassword = (password) => {
  // At least 6 characters
  return password && password.length >= 6;
};

const validateUsername = (username) => {
  // At least 3 characters, alphanumeric and underscores only
  return username && /^[a-zA-Z0-9_]{3,}$/.test(username);
};

const validateMilitaryRank = (rank) => {
  const validRanks = [
    "Jaunesnysis Eilinis",
    "Eilinis",
    "Vyresnysis Eilinis",
    "Grandinis",
    "SerŽantas",
    "Vyresnysis Seržantas",
    "Štabo Seržantas",
    "Viršila",
    "Seržantas Majoras",
    "Leitenанtas",
    "Vyr. leitenанtas",
    "Kapitonas",
    "Majoras",
    "Pulkininkas Leitenantas",
    "Pulkininkas",
  ];

  return validRanks.includes(rank);
};

const validateDate = (dateString) => {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
};

const validateUnit = (unit) => {
  const validUnits = [
    "Paramos burys",
    "Rysiu ir informaciniu sistemu burys",
    "Valdymo grupe",
  ];

  return validUnits.includes(unit);
};

const validateSubUnit = (subUnit, primaryUnit) => {
  if (primaryUnit !== "Rysiu ir informaciniu sistemu burys") {
    return !subUnit; // Should be null/undefined for other units
  }

  const validSubUnits = [
    "RIS burys",
    "LAN/WAN skyrius",
    "Videotelekonferencijos skyrius",
    "Laidinio rysio skyrius",
    "Kompiuteriniui tinklu skyrius",
    "1 rysiu skyrius",
    "2 rysiu skyrius",
    "Vartotoju aptarnavimo skyrius",
  ];

  return validSubUnits.includes(subUnit);
};

const validateAttendanceStatus = (status) => {
  const validStatuses = [
    "Present",
    "Absent",
    "Sick",
    "Leave",
    "Mission",
    "Other",
  ];
  return validStatuses.includes(status);
};

const validateEvaluationType = (type) => {
  const validTypes = ["Oficialus", "Neoficialus"];
  return validTypes.includes(type);
};

const validateRating = (rating) => {
  const validRatings = ["I", "IA", "NI", "-"];
  return validRatings.includes(rating);
};

const validateTaskType = (type) => {
  const validTypes = ["Individualios", "Kolektyvines"];
  return validTypes.includes(type);
};

const validateExerciseStage = (stage) => {
  const validStages = ["IS", "IT", "II", "-"];
  return validStages.includes(stage);
};

// Sanitization helpers
const sanitizeString = (str) => {
  if (typeof str !== "string") return str;
  return validator.escape(str.trim());
};

const sanitizeHtml = (str) => {
  if (typeof str !== "string") return str;
  return validator.escape(str);
};

// Validation middleware
const validateRequired = (fields) => {
  return (req, res, next) => {
    const missingFields = [];

    fields.forEach((field) => {
      if (!req.body[field]) {
        missingFields.push(field);
      }
    });

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    next();
  };
};

module.exports = {
  validateEmail,
  validatePassword,
  validateUsername,
  validateMilitaryRank,
  validateDate,
  validateUnit,
  validateSubUnit,
  validateAttendanceStatus,
  validateEvaluationType,
  validateRating,
  validateTaskType,
  validateExerciseStage,
  sanitizeString,
  sanitizeHtml,
  validateRequired,
};
