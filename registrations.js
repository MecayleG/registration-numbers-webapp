module.exports = function TheRegistrations(pool) {

    var numberPlates = [];


    async function addToDb(regEntered) {
        const code = regEntered.split(" ");
        console.log(code[0]);
        // select correct id for reg entered
        const getId = await pool.query('select id from towns where (code) = upper($1)', [code[0]]);
        const townId = getId.rows[0].id;
        let exists;
        if (townId > 0) {
            // check if reg exists in database
            exists = await pool.query('select * from reg_number where reg = ($1)', [regEntered])
        }
        if (exists.rows.length < 1) {
            // if reg does not exist insert reg and id into database
            await pool.query('insert into reg_number (reg, towns_id) values (upper($1), $2)', [regEntered, townId]);
        }
    }
    // filter according to town selected
    async function optionSelected(id) {
        const filter = await pool.query('select * from reg_number where town_id = ($1)', [id])
    }



    //function that does not add empty input and adds all valid registrations to array
    // function addingRegs(input) {
    //     if (input !== "") {
    //         if (/C[ALJ] \d{3,5}$/.test(input) || /C[ALJ] \d+\s|-\d+$/.test(input)) {
    //             numberPlates.push(input)
    //         } else {
    //             return false;
    //         }
    //     }
    // }
    //function that checks if reg entered is valid according to regEx
    function validate(reg) {
        if (/C[ALJ] \d{3,5}$/.test(reg) || /C[ALJ] \d+\s|-\d+$/.test(reg)) {
            return reg;

        } else {
            return false;
        }
    }

    // function noRepeat(entered) {
    //     if (!numberPlates.includes(entered)) {
    //         return entered;
    //     } else {
    //         return false;
    //     }
    // }
    // function displaying registrations according to radio button selected
    // function optionSelected(selectType) {
    //     if (selectType == "all") {
    //         return numberPlates;
    //     } else {
    //         var list = [];
    //         for (var i = 0; i < numberPlates.length; i++) {

    //             if (numberPlates[i].startsWith(selectType)) {

    //                 list.push(numberPlates[i])
    //             }
    //         }
    //         return list;
    //     }
    // }


    //function returning all the regs
    async function allTheRegs() {
        const allRegs = await pool.query('select reg from reg_number');
        console.log(allRegs.rows)
        return allRegs.rows;
    }
    return {
        addToDb,
        // addingRegs,
        validate,
        // noRepeat,
        optionSelected,
        allTheRegs
    }
}