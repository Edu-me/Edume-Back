const mongoose = require('mongoose');

let subjects = ["Arabic", "Math", "Science", "Biology", "Geology", "Physics", "Chemistry", "History", "Geoghraphic", "English"];
let levels = ["Primiary", "Preparatory", "Secondary"]
let systemLanguages = ["English", "Arabic"]
let levelSchema = new mongoose.Schema({
    level: {
        type: String,
        required: true,
        enum: {
            values: levels,
            message: '{VALUE} is not a supported level'
        }
    }
})

let subjectSchema = new mongoose.Schema({
    subject: {
        type: String,
        required: true,
        enum: {
            values: subjects,
            message: '{VALUE} is not a supported subject'
        }
    }
})
let systemLanguageSchema = new mongoose.Schema({
    language: {
        type: String,
        required: true,
        enum: {
            values: systemLanguages,
            message: '{VALUE} is not a supported system language'
        }
    }
})
let serviceSchema = new mongoose.Schema({
    subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'subjects'
    },
    level: {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'levels'
    },
    systemLanguage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'system-languages'
    }
})

const Level = mongoose.model('levels', levelSchema);
const SystemLanguage = mongoose.model('system-languages', systemLanguageSchema);
const Subject = mongoose.model('subjects', subjectSchema);
const Service = mongoose.model('service', serviceSchema);

exports.Subject= Subject
exports.SystemLanguage = SystemLanguage
exports.Level = Level
exports.Service = Service

