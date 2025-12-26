import mongoose, { Schema, model } from "mongoose";

const gameSchema = new Schema({
    userId: {
        userId: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
})

const Games = model('Games', gameSchema);

export default Games
