const assert = require('assert');

const Registrations = require("../factory/registrations");
const registration = require('../routes/registration');

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
        it("should return all registration numbers in the database", async function() {
            let registrations = Registrations(pool)
            await registrations.adding("CA 555")

            // const results = await pool.query("select reg from reg_number");

            assert.deepEqual([{ reg: 'CA 555' }], await registrations.optionSelected("all"));

        });
        it("should not add duplicate registration numbers into the database", async function() {
            let registrations = Registrations(pool)
            await registrations.adding("CA 555")
            await registrations.adding("CA 555")


            // const results = await pool.query("select reg from reg_number");

            assert.deepEqual([{ reg: 'CA 555' }], await registrations.allTheRegs());

        });

        it("should return all registrations starting with CA", async function() {
            let registrations = Registrations(pool)
            await registrations.adding("CA 555");
            await registrations.adding("CA 523");
            await registrations.adding("CJ 888");
            // const results = await pool.query("select reg from reg_number where towns_id = 1");
            assert.deepEqual([{ reg: "CA 555" }, { reg: "CA 523" }], await registrations.optionSelected("1"))
        });
        it("should return all registrations starting with CJ", async function() {
            let registrations = Registrations(pool)
            await registrations.adding("CJ 225");
            await registrations.adding("CJ 555-222");
            await registrations.adding("CL 157");
            await registrations.adding("CJ 3658");
            await registrations.adding("CA 414");


            assert.deepEqual([{ reg: "CJ 225" }, { reg: "CJ 555-222" }, { reg: "CJ 3658" }], await registrations.optionSelected("3"))
        });
        it("should return all registrations starting with CL", async function() {
            let registrations = Registrations(pool)
            await registrations.adding("CJ 225");
            await registrations.adding("CJ 555-222");
            await registrations.adding("CL 157");
            await registrations.adding("CJ 3658");
            await registrations.adding("CA 414");


            assert.deepEqual([{ reg: "CL 157" }], await registrations.optionSelected("2"))
        });

    });
    describe("The allTheRegs function", function() {
        it("should return the 3 registration numbers in the database", async function() {
            let registrations = Registrations(pool)

            await registrations.adding("CJ 888");
            await registrations.adding("CL 692");
            await registrations.adding("CL 541");
            assert.deepEqual([{ reg: "CJ 888" }, { reg: "CL 692" }, { reg: "CL 541" }], await registrations.allTheRegs());
        });
        it("should return the 2 registration numbers in the database ", async function() {
            let registrations = Registrations(pool)

            await registrations.adding("CJ 888");
            await registrations.adding("CL 692");
            assert.deepEqual([{ reg: "CJ 888" }, { reg: "CL 692" }], await registrations.allTheRegs());
        });
        it("should return the 1 registration number in the database ", async function() {
            let registrations = Registrations(pool)

            await registrations.adding("CL 541");
            assert.deepEqual([{ reg: "CL 541" }], await registrations.allTheRegs());
        });
    });
    after(function() {
        pool.end();
    })

});