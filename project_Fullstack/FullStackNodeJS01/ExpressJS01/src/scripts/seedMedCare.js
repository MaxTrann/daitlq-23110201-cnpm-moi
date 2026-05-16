require('dotenv').config();
const connectDB = require('../config/database');
const { clearCatalog, ensureMedCareCatalog } = require('../services/medcare/seedService');

(async () => {
    try {
        await connectDB();
        process.env.MEDCARE_RESET_CATALOG = 'true';
        await clearCatalog();
        await ensureMedCareCatalog();
        console.log('MedCare seed completed');
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
})();
