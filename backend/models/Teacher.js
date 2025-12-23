const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const slotSchema = new mongoose.Schema({
    day: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true }
}, { _id: false });

const teacherSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        match: /^[0-9]{10}$/
    },
    password: { type: String, required: true },

    // Professional Details - Store both IDs and Names
    experienceYears: { type: Number, required: true },
    bio: { type: String, required: true },

    // Teaching Field (e.g., {fieldId: "eng", fieldName: "Engineering"})
    teachingField: {
        fieldId: { type: String, required: true },
        fieldName: { type: String, required: true }
    },

    // Program/Degree (e.g., {programId: "cse", programName: "Computer Science & Engineering"})
    program: {
        programId: { type: String, required: true },
        programName: { type: String, required: true }
    },

    // Subjects - Store actual subject names (e.g., ["Algebra", "Calculus"])
    selectedSubjects: [{ type: String, required: true }],

    // Teaching Mode & Pricing
    teachingMode: {
        type: String,
        enum: ['online', 'offline', 'both'],
        required: true
    },
    onlinePrice: {
        type: Number,
        required: function () {
            return this.teachingMode === 'online' || this.teachingMode === 'both';
        }
    },
    offlinePrice: {
        type: Number,
        required: function () {
            return this.teachingMode === 'offline' || this.teachingMode === 'both';
        }
    },
    offlineLocation: {
        type: String,
        required: function () {
            return this.teachingMode === 'offline' || this.teachingMode === 'both';
        }
    },

    // Availability
    slots: [slotSchema],

    // Documents (Cloudinary URLs)
    qualificationFile: { type: String },
    idProofFile: { type: String },

    // Status
    isVerified: { type: Boolean, default: false },
    isPremium: { type: Boolean, default: false }
}, { timestamps: true });

/**
 * 🔐 Hash password before saving
 */
teacherSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

/**
 * 🔑 Helper method to compare plain text password with hash
 */
teacherSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Teacher', teacherSchema);
