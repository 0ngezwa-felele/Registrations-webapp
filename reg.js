module.exports = function RegMain(pool) {

    // allowing user to instert reg numbers

    async function insert(reg) {
        let twoChar = reg.substring(0, 2);
        let regTown = await pool.query("Select * from towns where loc = $1", [twoChar])
        let regNumba = await pool.query(`Select * from registrations where regNo = '${reg}'`)
        if (regTown.rows.length == 0) {
            message = "Enter"
        } else
            if (regNumba.rows.length == 0) {
                await pool.query(`insert into registrations (regNo, townId) values ('${reg}', '${regTown.rows[0].id}')`)
            }
    }



    // getting values 
    async function getReg() {
        let regNum = await pool.query('SELECT regNo, townID FROM registrations');
        return regNum.rows

    }
    // Getting Foreign key
    async function foreignKey(getKey) {
        let oneKey = getKey.substring(0, 2);
        let keyValue = await pool.query('SELECT id FROM towns WHERE loc = $1', [oneKey]);

        return keyValue.rows[0].id
    }

    async function filter(eachTown) {

        var eachReg = await foreignKey(eachTown);
        let reg2 = await pool.query('SELECT regNo FROM registrations WHERE  townID = $1', [eachReg]);

        return reg2.rows
    }

    async function reset() {
       let allDel = await pool.query('DELETE FROM registrations');
       return allDel.rows;
    }

    return {
        insert,
        getReg,
        reset,
        filter,
    }

}
