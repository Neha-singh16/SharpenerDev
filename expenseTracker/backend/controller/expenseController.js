const Expense = require("../models/expenseModel");
const bcrypt = require("bcrypt");

const generateToken=require("../utils/generateToken");

const auth = require("../utils/auth");

async function addExpense(req, res) {
    try {
        const {amount, description, category} = req.body;
        const userId = req.user.id;
        const expense = await Expense.create({amount, description, category, UserId: userId});
        res.status(201).json({message: "expense added successfully", expense});
    } catch (error) {
        res.status(500).json({message: "Error adding expense", error});
    }
}


 async function getAllExpenses(req,res){
    try{
        const userId = req.user.id;
        console.log(userId);
        const expense = await Expense.findAll({where: {UserId: userId}});
        console.log(expense);

          res.status(201).json({message: "expense fetched successfully", expense});

    }catch(err){
        res.status(500).json({message: "Error fetching expenses", err});
    }
 }


 async function deleteExpense(req,res){
    try{
        const expenseId = req.params.id;
        const userId = req.user.id;

      const expense = await Expense.findOne({where:{id: expenseId, UserId: userId}});
      if(!expense){
        return res.status(404).json({message: "Expense not found"})
      }
      await expense.destroy();
      res.status(200).json({message: "Expense deleted successfully"});

    }catch(err){
        res.status(500).json({message: "Error deleting expense", error});
    }
 }


 async function updateExpense(req,res){
    try{
        const expenseId = req.params.id;
        const userId = req.user.id;
        const {amount , description, category} =req.body;

        const expense = await Expense.findOne({where: {id:expenseId , userId}});
         if(!expense){
        return res.status(404).json({message: "Expense not found"})
      }

      const updateExpense = await Expense.update({amount, description, category}, {where: {id: expenseId, UserId: userId}});

      res.status(200).json({message: "Expense updated successfully", expense: updateExpense});

    }catch(err){
         res.status(500).json({message: "Error updating expense", error});
    }
 }
module.exports = { addExpense, getAllExpenses, deleteExpense, updateExpense };
