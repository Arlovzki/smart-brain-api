
const handleRegister = (req, res, db, bcrypt) => {
      
    const {email,password} = req.body;
    let {name} = req.body;

    if(!email || !name || !password){
        return res.status(400).json('incorrect form submission');
    }

    name = name.toLowerCase();
    name = name[0].toUpperCase() + name.slice(1)
    const hash = bcrypt.hashSync(password);
    db.transaction(trx =>{
        trx.insert({
            hash: hash,
            email: email
        })
        .into('login')
        .returning('email')
        .then(loginEmail=>{
            return trx('users')
             .returning('*')
             .insert({
                 email: loginEmail[0],
                 name: name,
                 joined: new Date()
             })
             .then(user=>{
                 res.json(user[0]);
             })
             .catch(err => res.status(400).json('transaction failed'))
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })
     .catch(err => res.status(400).json('unable to register'))
 
 }


module.exports= {
  handleRegister: handleRegister  
};