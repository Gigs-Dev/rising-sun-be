import mongoose, { model, Schema } from "mongoose";

const adminSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        min: [12, 'Passsword must be at least 12 characters!'],
        select: false,
    },
    role: {
        type: String,
        enum: ['super_admin', 'admin'],
        default: 'admin'
    }
},
    { timestamps: true }
)

const Admins = model('Admins', adminSchema);

export default Admins;
