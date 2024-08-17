import mongoose, { model, Schema } from "mongoose";

const TradeSchema = new Schema({
    amount: {
        type: Number,
        required: true
    },
    
})


const Trade = model('Trade', TradeSchema);
export default Trade;
