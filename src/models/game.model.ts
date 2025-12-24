import mongoose, { Schema, model } from "mongoose";

const gameSchema = new Schema({
    userId: {
        userId: Schema.Types.ObjectId,
        ref: 'User',
    },
})

const Games = model('Games', gameSchema);

export default Games
