// routes
module.exports = function RegRoutes(registrations) {

    async function add(req, res, next) {
        let value = req.body.input
        try {
            let upper = value.toUpperCase();
            if (value !== "") {
                if (/C[ALJ] \d{3,5}$/.test(upper) || /C[ALJ] \d+\s|-\d+$/.test(upper)) {
                    if (await registrations.ifRegExists(upper) === 0) {
                        await registrations.adding(upper)
                        req.flash('msg', 'success')
                    } else {
                        req.flash('info', 'registration number already entered')
                    }
                } else {
                    req.flash('info', 'enter a valid registration number')
                }
            } else {
                req.flash('info', 'enter a registration number')
            }
            res.render("index", {
                reg: await registrations.allTheRegs()
            });

        } catch (err) {
            next(err);
        }
    };
    async function showAll(req, res, next) {
        try {
            res.render("index", {
                reg: await registrations.allTheRegs()

            });
        } catch (err) {
            next(err);
        }
    }
    async function filter(req, res, next) {
        try {
            let town = req.query.opt;
            let all = await registrations.optionSelected(town)

            res.render("index", {
                reg: all
            });
        } catch (err) {
            next(err);
        }

    }
    return {
        add,
        showAll,
        filter
    }
};