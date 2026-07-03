
const Expense = require("../models/expenseModel");
const addExpense= async(req,res) => {
    try{
        const {amount,description,category}= req.body;
        const expense = await Expense.create({amount,description,category});
        res.status(201).send(expense);

    }catch(err){
        console.log(err);
        res.status(500).send(err.message);
    }

}

const getExpense = async(req,res)=> {
    try{
        const expense = await Expense.findAll();
         res.status(201).send(expense);

    }catch(err){
 console.log(err);
        res.status(500).send(err.message);
    }
}


const deleteExpense = async(req,res)=> {
    try{
        const expenseId = req.params.id;
        const expense =await Expense.findByPk(expenseId);
        if(!expense){
            return res.status(404).send("Expense not found!!");
        }
        await expense.destroy();
         res.status(200).send("Expense deleted successfully");


    }catch(err){
 console.log(err);
        res.status(500).send(err.message);
    }
}

module.exports = {
    addExpense,
    getExpense,
    deleteExpense
};
   
