module.exports = function TheRegistrations() {

    var numberPlates = [];


    //function that does not add empty input and adds all valid registrations to array
    function addingRegs(input) {
        if (input !== "") {
            if (/C[ALJ] \d{3,5}$/.test(input) || /C[ALJ] \d+\s|-\d+$/.test(input)) {
                numberPlates.push(input)
            } else {
                return false;
            }
        }
    }
    //function that checks if reg entered is valid according to regEx
    function validate(reg) {
        if (/C[ALJ] \d{3,5}$/.test(reg) || /C[ALJ] \d+\s|-\d+$/.test(reg)) {
            return reg;

        } else {
            return false;
        }
    }

    function noRepeat(entered) {
        if (!numberPlates.includes(entered)) {
            return entered;
        } else {
            return false;
        }
    }
    // function displaying registrations according to radio button selected
    function optionSelected(selectType) {
        if (selectType == "all") {
            return numberPlates;
        } else {
            var list = [];
            for (var i = 0; i < numberPlates.length; i++) {

                if (numberPlates[i].startsWith(selectType)) {

                    list.push(numberPlates[i])
                }
            }
            return list;
        }
    }


    //function returning theRegs
    function allTheRegs() {
        console.log(numberPlates)
        return numberPlates;
    }
    return {
        addingRegs,
        validate,
        noRepeat,
        optionSelected,
        allTheRegs
    }
}