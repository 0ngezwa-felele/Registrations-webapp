const assert = require('assert');
const registration = require('../reg');
const pg = require("pg");
const Pool = pg.Pool;

let useSSL = false;
let local = process.env.LOCAL || false;
if (process.env.DATABASE_URL && !local) {
    useSSL = true;
}
// DB connection string
const connectionString = process.env.DATABASE_URL || 'postgresql://codex:pg123@localhost:5432/my_reg';

const pool = new Pool({
    connectionString
    // ssl: useSSL
});
const newReg = registration(pool);

describe('registration test', async function () {
    beforeEach(async function () {
        await pool.query("delete from registrations;");
    });
    it('should be able to add a registration number when the add button is clicked', async function () {
        let regNo = 'CA-123';
        await newReg.insert(regNo)
        assert.deepEqual( [{
            regno: 'CA-123',
            townid: 1
          }
        ]
           , await newReg.getReg());
    });

    it('should be able to filter registration numbers by town', async function () {
        
        await newReg.insert('CA-456');
        await newReg.insert('CJ-456');
        await newReg.insert('CY-456');
        assert.deepEqual([
            {
              regno: 'CA-456'
            }
          ]
          , await newReg.filter('CA'));
    });
    it('should be able to clear the database when the reset button', async function () {
        
        let num = 'CY-456'
        await newReg.insert(num);
        assert.deepEqual([], await newReg.reset());
    });


        
    after(function () {
        pool.end();
    });
});