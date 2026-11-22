const PORT = process.env.PORT || 3001;
require('./src/app').listen(PORT, () => console.log(`user-service on ${PORT}`));
