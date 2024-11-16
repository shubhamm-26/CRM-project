const mongoose = require('mongoose');
const validator = require('validator');

const contactSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Invalid email');
            }
        }
    },
    phone: {
        type: String,
        required: true,
        trim: true,
        validate(value) {
            if (!validator.isMobilePhone(value)) {
                throw new Error('Invalid phone number');
            }
        }
    },
    company: {
        type: String,
        required: true,
        trim: true
    },
    jobTitle: {
        type: String,
        required: true,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

contactSchema.index({ firstName: 'text', lastName: 'text', email: 'text', phone: 'text', company: 'text', jobTitle: 'text' });

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;