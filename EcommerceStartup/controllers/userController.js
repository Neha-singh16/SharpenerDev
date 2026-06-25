const getUser = (req,res) => {
      res.send("Fetch all users");
}

const getUserById = (req,res) => {
    const {id} = req.params;
     res.send(`Fetch a user by their id : ${id}`);
}

const addUser = (req,res) => {
     res.send("Add a new user.");
}

module.exports ={
    getUser,
    getUserById,
    addUser
};