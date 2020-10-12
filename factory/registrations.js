// factory function
module.exports = function TheRegistrations(pool) {

    async function adding(regEntered) {
        if (regEntered !== "") {
            const code = regEntered.substring(0, 2);
            // select correct id for reg entered
            const getId = await pool.query('select id from towns where (code) = ($1)', [code]);
            const townId = getId.rows[0].id;
            let exists;
            if (townId > 0) {
                // check if reg exists in database
                exists = await pool.query('select * from reg_number where reg = ($1)', [regEntered])
            } else {
                return false
            }
            if (exists.rows.length < 1) {
                // if reg does not exist insert reg and id into database
                await pool.query('insert into reg_number (reg, towns_id) values ($1, $2)', [regEntered, townId]);
            } else {
                return false
            }
        } else {
            return false
        }
    }
    // getting rowCount to use for flash error message
    async function ifRegExists(reg) {
        let exists = await pool.query('select * from reg_number where reg = ($1)', [reg])
        return exists.rowCount;
    }
    // filter according to town selected
    async function optionSelected(id) {
        if (id === 'all') {
            let allRegs = await pool.query('select reg from reg_number');
            return allRegs.rows
        } else {
            const theId = await pool.query('select reg from reg_number where towns_id = ($1)', [id])
            return theId.rows
        }
    }

    //function returning all the regs
    async function allTheRegs() {
        const allRegs = await pool.query('select reg from reg_number');
        return allRegs.rows;
    }
    return {
        adding,
        ifRegExists,
        optionSelected,
        allTheRegs
    }
}