// models/MailServer.js
import mongoose from 'mongoose';

const MailServerSchema = new mongoose.Schema({
  server_name: { type: String, required: true },
  server_ip: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  from_email: { type: String, required: true },
  port: { type: Number, required: true },
  encryption: { type: String, enum: ['ssl', 'tls'], required: true },
  live_status: { type: Number, enum: [1, 2], default: 1 }, // 1=Healthy, 2=Unhealthy
  status: { type: Number, enum: [1, 2], default: 2 }       // 1=Disabled, 2=Active
}, {
  timestamps: true
});

// 👇 Register model
const MailServer = mongoose.model('mail_servers', MailServerSchema);

// 👇 Utility function to get active mail server
const getActiveMailServer = async () => {
  try {
    const server = await MailServer.findOne({ status: 2 });
    return server || {};
  } catch (error) {
    console.error('Error fetching active mail server:', error);
    return {};
  }
};


export { MailServer, getActiveMailServer };
