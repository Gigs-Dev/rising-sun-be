import { Schema, model } from "mongoose";

const gameSchema = new Schema({
    userId: {
        userId: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    stackAmount: {
        type: Number,
        required: true
    },
    choice: {
        type: String,
        enum: ['up', 'down', 'neutral']
    },
    result: {
        type: Boolean,
    },
},
    { timestamps: true }
)

const Games = model('Games', gameSchema);

export default Games
