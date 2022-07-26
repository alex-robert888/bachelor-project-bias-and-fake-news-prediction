import mongoose from 'mongoose';

export default mongoose.model('Source', new mongoose.Schema({
  name: { 
    type: String, 
    trim: true 
  },
  url: { 
    type: String, 
    trim: true 
  }, 
  summary: { 
    type: String, 
    trim: true 
  },
  status: [{
    type: String,
    enum: ["generally reliable", "no consensus", "generally unreliable", "deprecated", "blacklisted"] 
  }], 
}));
