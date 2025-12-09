import mongoose from 'mongoose';

const GeneralNoteDataSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
});

export default GeneralNoteDataSchema;
