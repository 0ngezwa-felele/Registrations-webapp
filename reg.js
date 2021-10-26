module.exports =  function regMain(pool) {


// adding
    async function addReg(numbers) {
		let string = numbers.substring(1)
		let allNumb = await pool.query('SELECT id FROM towns WHERE townID = $1'[string]);
		if (allNumb.rows == '') {
			await getReg(numbers)
		}
		return allNumb.rows

	};
// allowing user to instert reg numbers

    // var reg = pool;
    // var message = "";
   async function insert(reg){
	   console.log(reg)
       let twoChar = reg.substring(0, 2);
       let regTown = await pool.query("Select * from towns where loc = $1", [twoChar])
       let regNumba = await pool.query(`Select * from registrations where regNo = '${reg}'`)
       if(regTown.rows.length == 0){
           message = "Enter"
       }else
       if(regNumba.rows.length == 0){
           await pool.query(`insert into registrations (regNo, townId) values ('${reg}', '${regTown.rows[0].id}')`)
       }
   }
    

    // async function getAll() {
	// 	let getRegnum = await pool.query('SELECT * FROM registrations')
	// 	return getRegnum.rows
		
	// };
	
	// getting values 
	async function getReg(){
		// var numPlate  = getting.substring(1)
		let regNum = await pool.query('SELECT * FROM registrations');
		return regNum.rows
		
	}
	async function reset() {
        await pool.query('DELETE FROM registrations');
    }

    return {
        regMain,
        addReg,
        insert,
        getReg,
		getReg,
		reset
    }

}
