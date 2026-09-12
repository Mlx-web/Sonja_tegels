module.exports = process.env.NETLIFY_API_TOKEN ? require('./contact.netlify-forms') : require('./contact.local');
