const assert = require('assert');

const Registrations = require("../registrations");

describe("The Registrations Number Webapp", function() {
    const pg = require("pg");
    const Pool = pg.Pool;
    const connectionString = process.env.DATABASE_URL || 'postgresql://root:mecayle123@localhost:5432/test';
    const pool = new Pool({
        connectionString
    });
    const INSERT_QUERY = "insert into reg_number (reg) values ($1)";
    beforeEach(async function() {
        await pool.query("delete from reg_number");
    });
    describe("The optionSelected function", function() {
        it("should return all regs", async function() {

            await pool.query(INSERT_QUERY, ["CA 555"]);

            const results = await pool.query("select reg from reg_number");

            assert.deepEqual([{ reg: 'CA 555' }], results.rows);

        });
        it("should return 2 regs starting with CA", async function() {
            let registrations = Registrations(pool)
            await registrations.adding("CA 555");
            await registrations.adding("CA 523");
            await registrations.adding("CJ 888");
            const results = await pool.query("select reg from reg_number where towns_id = 1");
            assert.deepEqual([{ reg: "CA 555" }, { reg: "CA 523" }], results.rows)
        });
        it("should return 5 regs starting with CJ", async function() {
            let registrations = Registrations(pool)
            await registrations.adding("CJ 225");
            await registrations.adding("CJ 555-222");
            await registrations.adding("CJ 157");
            await registrations.adding("CJ 3658");
            await registrations.adding("CJ 414");

            const results = await pool.query("select reg from reg_number where towns_id = 3");

            assert.deepEqual([{ reg: "CJ 225" }, { reg: "CJ 555-222" }, { reg: "CJ 157" }, { reg: "CJ 3658" }, { reg: "CJ 414" }], results.rows)
        });
    });
    describe("The ifRegExists function", function() {
        it("should return the 1 for CJ 225", async function() {
            let reg = "CJ 225"
            await pool.query(INSERT_QUERY, [reg]);

            let results = await pool.query("select reg from reg_number where reg = $1", [reg]);

            assert.deepEqual(1, results.rowCount);

        });
        it("should return the 2 for CL 225-666", async function() {
            let reg = "CL 225-666"
            await pool.query(INSERT_QUERY, [reg]);
            await pool.query(INSERT_QUERY, [reg]);


            let results = await pool.query("select reg from reg_number where reg = $1", [reg]);

            assert.deepEqual(2, results.rowCount);

        });
        it("should return the 5 for CA 77237", async function() {
            let reg = "CA 77237"
            await pool.query(INSERT_QUERY, [reg]);
            await pool.query(INSERT_QUERY, [reg]);
            await pool.query(INSERT_QUERY, [reg]);
            await pool.query(INSERT_QUERY, [reg]);
            await pool.query(INSERT_QUERY, [reg]);
            let results = await pool.query("select reg from reg_number where reg = $1", [reg]);

            assert.deepEqual(5, results.rowCount);

        });
    });
    describe("The allTheRegs function", function() {
        it("should return 3 regs", async function() {
            await pool.query(INSERT_QUERY, ["CJ 888"]);
            await pool.query(INSERT_QUERY, ["CL 692"]);
            await pool.query(INSERT_QUERY, ["CL 541"]);
            const results = await pool.query("select reg from reg_number");
            assert.deepEqual([{ reg: "CJ 888" }, { reg: "CL 692" }, { reg: "CL 541" }], results.rows);
        });
        it("should return 2 regs ", async function() {
            await pool.query(INSERT_QUERY, ["CJ 888"]);
            await pool.query(INSERT_QUERY, ["CL 692"]);
            const results = await pool.query("select reg from reg_number");
            assert.deepEqual([{ reg: "CJ 888" }, { reg: "CL 692" }], results.rows);
        });
        it("should return 1 reg ", async function() {
            await pool.query(INSERT_QUERY, ["CL 541"]);
            const results = await pool.query("select reg from reg_number");
            assert.deepEqual([{ reg: "CL 541" }], results.rows);
        });
    });
    after(function() {
        pool.end();
    })

});