import mongoose from 'mongoose';

export default mongoose.model('feedback', new mongoose.Schema({
  url: { 
    type: String, 
    trim: true 
  }, 
  title: { 
    type: String, 
    trim: true 
  },
  text: { 
    type: String, 
    trim: true 
  },
  authors: [{
    type: String,
    trim: true
  }],
  rating: {
    type: String,
    enum: ["highly unreliable", "unreliable", "fairly unreliable", "reliable", "highly reliable"] 
  },
  comment: {
    type: String,
    trim: true
  },
  
}));
