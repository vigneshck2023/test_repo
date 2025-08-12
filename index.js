const express = require("express");
const app = express();
const {initializeDatabase} = require("./db/db.connect");
const Recipe = require("./models/recipe.models");
app.use(express.json())
initializeDatabase();
require('dotenv').config();


app.get("/", (req,res) => {
    res.send(`Hello from Express Server`);
})

async function createRecipe(newRecipe){
    try{
        const recipe = new Recipe(newRecipe);
        const saveRecipe = await recipe.save();
        return saveRecipe;
    }
    catch(error){
        throw error;
    }
}

app.post("/recipes", async (req,res) => {
    try{
        const savedRecipe = await createRecipe(req.body)
        res.status(201).json({message: "Recipe added successfully", recipe: savedRecipe});
    }
    catch(error){
        res.status(500).json({error: "Failed to add the recipe"});
    }
})

//------------- All Recipes ----------------
async function readAllRecipes(){
    try{
        const recipe = await Recipe.find();
        return recipe;
    }
    catch(error){
        throw error;
    }
}

app.get("/recipeData", async (req,res) => {
    try{
        const allRecipes = await readAllRecipes();
        if(allRecipes.length !== 0){
            res.json(allRecipes);
        }
        else{
             res.status(404).json({ error: "No Recipes found" });
        }
    }
    catch(error){
        throw error;
    }
})

//--------------- find recipe by title -----------------
async function findByTitle(recipeTitle){
    try{
        const recipe = await Recipe.find({title: recipeTitle});
        return recipe;
    }
    catch(error){
        throw error;
    }
}

app.get("/recipes/:recipeTitle", async (req,res) => {
    try{
        const recipes = await findByTitle(req.params.recipeTitle);
        if(recipes.length !== 0){
            res.json(recipes);
        }
        else{
            res.status(404).json({ error: "No Recipes found" });
        }
    }
    catch(error){
        throw error;
    }
})

//-------------------- find recipe by author -----------------------
async function findByAuthor(recipeAuthor){
    try{
        const recipe = await Recipe.find({author: recipeAuthor});
        return recipe;
    }
    catch(error){
        throw error;
    }
}

app.get("/recipes/Author/:recipeAuthor", async (req,res) => {
    try{
        const recipe = await findByAuthor(req.params.recipeAuthor);
        if(recipe.length !== 0){
            res.json(recipe);
        }
        else{
            res.status(404).json({ error: "No Recipes found" });
        }
    }
    catch(error){
        res.status(500).json({error: "Error, Check your code"});
    }
})

//------------------ find recipes by difficulty level ---------------------
async function findByDifficultyLevel(difficultyLevel){
    try{
        const recipe = await Recipe.find({difficulty: difficultyLevel});
        return recipe;
    }
    catch(error){
        throw error;
    }
}

app.get("/recipes/difficulty/:difficultyLevel", async (req,res) => {
    try{
        const recipe = await findByDifficultyLevel(req.params.difficultyLevel);
        if(recipe.length !== 0){
            res.json(recipe);
        }
        else{
            res.status(404).json({ error: "No Recipes found" });
        }
    }
    catch(error){
        res.status(500).json({error: "Error, Check your code"});
    }
})

//--------------------find by Id and update the difficulty -------------------
async function findAndUpdate(recipeId,dataToUpdate){
    try{
        const recipe = await Recipe.findByIdAndUpdate(recipeId,dataToUpdate,{new: true});
        return recipe;
    }
    catch(error){
        throw error;
    }
}

app.post("/recipes/id/:recipeId", async (req,res) => {
    try{
        const updatedRecipe = await findAndUpdate(req.params.recipeId,req.body);
        if(updatedRecipe.length !== 0){
            res.status(200).json({message: "Data updated successfully", recipe: updatedRecipe});
        }
        else{
            res.status(404).json({error: "Recipe not found"})
        }
    }
    catch(error){
        res.status(500).json({ error: "Failed to update the data." });
    }
})

//----------------------- update recipe data ---------------------------
async function updateRecipeData(recipeId, dataToUpdate) {
    try {
        const recipe = await Recipe.findByIdAndUpdate(recipeId, dataToUpdate, { new: true });
        return recipe;
    } catch (error) {
        throw error;
    }
}

app.post("/recipes/title/:recipeId", async (req, res) => {
    try {
        const updatedRecipe = await updateRecipeData(req.params.recipeId, req.body);
        if (updatedRecipe) {
            res.status(200).json({ message: "Data updated successfully", recipe: updatedRecipe });
        } else {
            res.status(404).json({ error: "Recipe not found" });
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to update the data" });
    }
});

// ---------------------- Delete the data --------------------------
async function deleteRecipe(recipeId){
    try{
        const recipe = await Recipe.findByIdAndDelete(recipeId);
        return recipe;
    }
    catch(error){
        throw error;
    }
}

app.delete("/recipes/:recipeId", async (req,res) => {
    try{
        const deletedData = await deleteRecipe(req.params.recipeId);
        if(deletedData){
            res.status(200).json({ message: "Recipe deleted successfully", book: deletedData });
        }
        else{
            res.status(404).json({ error: "Recipe not found" });
        }
    }
    catch(error){
         res.status(500).json({ error: "Failed to delete book." });
    }
    
})
const PORT = process.env.PORT || 5050;

app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});
