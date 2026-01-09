import { Schema, model } from "mongoose";

const gameSchema = new Schema({
    userId: {
        userId: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    game: {
        type: String,
        required: true
    },
},
    { timestamps: true }
)

const Games = model('Games', gameSchema);

export default Games
