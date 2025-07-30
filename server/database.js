const { Pool } = require('pg');

const pool = new Pool({
  connectionString: "postgresql://postgres:eFrDEIpvEmcjCQphishAnIpJWrqmmYsW@postgres.railway.internal:5432/railway"
});

module.exports = pool;
