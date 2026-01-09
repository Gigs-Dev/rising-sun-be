import { Schema, model } from "mongoose";

const gameSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
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
