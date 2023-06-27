const app = require('./app');
const { logInfo } = require('./utils/logger');
const config = require('./utils/config');

app.listen(config.PORT, () => logInfo(`Server running on port ${config.PORT}`));
