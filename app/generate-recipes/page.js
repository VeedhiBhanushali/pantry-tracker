"use client";

import { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { useRouter } from "next/navigation";
import { app, firestore } from "../firebase/config";
import Navbar from "../components/Navbar";
import { collection, query, where, getDocs } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import { FaUtensils, FaClock, FaList } from 'react-icons/fa';
import "react-toastify/dist/ReactToastify.css";

const GenerateRecipes = () => {
  const [user, setUser] = useState(null);
  const [pantryItems, setPantryItems] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        fetchPantryItems(user.uid);
      } else {
        router.push("/");
      }
    });
    return () => unsubscribe();
  }, [router]);

  const fetchPantryItems = async (userId) => {
    try {
      const q = query(
        collection(firestore, "inventory"),
        where("userId", "==", userId)
      );
      const querySnapshot = await getDocs(q);
      const items = querySnapshot.docs.map((doc) => doc.data().name.toLowerCase());
      setPantryItems(items);
    } catch (error) {
      console.error("Error fetching pantry items:", error);
      toast.error("Failed to load pantry items");
    }
  };

  const generateRecipes = async () => {
    setLoading(true);
    try {
      const recipeDatabase = [
        {
          name: "Pasta with Tomato Sauce",
          ingredients: ["pasta", "tomato sauce", "garlic", "olive oil", "onion", "herbs"],
          cookingTime: "20 mins",
          instructions: "1. Bring a large pot of salted water to boil\n2. Cook pasta according to package instructions\n3. Meanwhile, heat olive oil in a pan over medium heat\n4. Sauté diced onion until translucent (5 mins)\n5. Add minced garlic and cook for 1 minute\n6. Pour in tomato sauce and add herbs\n7. Simmer for 10 minutes\n8. Drain pasta and combine with sauce\n9. Season with salt and pepper to taste",
          difficulty: "Easy"
        },
        {
          name: "Rice and Beans Bowl",
          ingredients: ["rice", "black beans", "onion", "garlic", "bell pepper", "cumin", "olive oil"],
          cookingTime: "30 mins",
          instructions: "1. Rinse rice until water runs clear\n2. Cook rice with 2:1 ratio of water to rice\n3. Dice onion, garlic, and bell pepper\n4. Heat oil in a pan over medium heat\n5. Sauté vegetables until soft (5-7 mins)\n6. Add drained beans and cumin\n7. Cook until heated through\n8. Season with salt and pepper\n9. Serve beans over rice",
          difficulty: "Easy"
        },
        {
          name: "Vegetable Stir Fry",
          ingredients: ["vegetables", "oil", "soy sauce", "rice", "garlic", "ginger"],
          cookingTime: "20 mins",
          instructions: "1. Cook rice according to package instructions\n2. Chop all vegetables into similar sizes\n3. Heat oil in a wok or large pan until very hot\n4. Add minced garlic and ginger, stir for 30 seconds\n5. Add harder vegetables first (carrots, broccoli)\n6. After 2-3 minutes, add softer vegetables\n7. Add soy sauce and stir well\n8. Cook until vegetables are crisp-tender\n9. Serve hot over rice",
          difficulty: "Easy"
        },
        {
          name: "Simple Chicken and Rice",
          ingredients: ["chicken", "rice", "onion", "garlic", "chicken broth", "butter", "herbs"],
          cookingTime: "45 mins",
          instructions: "1. Season chicken with salt and pepper\n2. Heat butter in a large pan\n3. Brown chicken on both sides (5-7 mins each)\n4. Remove chicken and set aside\n5. Sauté diced onion and garlic\n6. Add rice and stir to coat\n7. Add broth and herbs\n8. Return chicken to pan\n9. Cover and simmer for 20-25 minutes\n10. Let rest 5 minutes before serving",
          difficulty: "Medium"
        },
        {
          name: "Quick Potato Hash",
          ingredients: ["potatoes", "onion", "bell pepper", "garlic", "oil", "paprika"],
          cookingTime: "25 mins",
          instructions: "1. Dice potatoes into small cubes\n2. Chop onion and bell pepper\n3. Heat oil in a large skillet\n4. Add potatoes and cook for 10 minutes\n5. Add vegetables and garlic\n6. Season with paprika, salt, and pepper\n7. Cook until potatoes are crispy\n8. Serve hot",
          difficulty: "Easy"
        },
        {
          name: "Lentil Soup",
          ingredients: ["lentils", "onion", "carrot", "celery", "garlic", "vegetable broth", "tomatoes"],
          cookingTime: "40 mins",
          instructions: "1. Rinse lentils thoroughly\n2. Dice all vegetables\n3. Heat oil in a large pot\n4. Sauté onion, carrot, and celery (5 mins)\n5. Add garlic and cook for 1 minute\n6. Add lentils, broth, and tomatoes\n7. Bring to boil, then simmer\n8. Cook for 20-25 minutes\n9. Season to taste",
          difficulty: "Easy"
        },
        {
          name: "Breakfast Omelette",
          ingredients: ["eggs", "cheese", "bell pepper", "onion", "mushrooms", "butter", "milk"],
          cookingTime: "15 mins",
          instructions: "1. Whisk eggs with a splash of milk and season with salt and pepper\n2. Dice vegetables finely\n3. Melt butter in a non-stick pan over medium heat\n4. Sauté vegetables until softened\n5. Pour in egg mixture\n6. When edges start to set, add cheese\n7. Fold omelette in half\n8. Cook until cheese melts\n9. Serve immediately",
          difficulty: "Easy"
        },
        {
          name: "Mediterranean Quinoa Bowl",
          ingredients: ["quinoa", "cucumber", "tomatoes", "olive oil", "lemon", "feta cheese", "chickpeas", "herbs"],
          cookingTime: "25 mins",
          instructions: "1. Rinse quinoa thoroughly\n2. Cook quinoa in 2 cups water until fluffy (15-20 mins)\n3. Drain and rinse chickpeas\n4. Dice cucumber and tomatoes\n5. Make dressing: mix olive oil, lemon juice, and herbs\n6. Combine all ingredients in a bowl\n7. Crumble feta on top\n8. Drizzle with dressing\n9. Season to taste",
          difficulty: "Easy"
        },
        {
          name: "Quick Fish Tacos",
          ingredients: ["fish fillets", "tortillas", "cabbage", "lime", "sour cream", "garlic", "oil", "spices"],
          cookingTime: "20 mins",
          instructions: "1. Season fish with spices\n2. Heat oil in a pan over medium-high heat\n3. Cook fish 3-4 minutes per side\n4. Warm tortillas\n5. Shred cabbage and toss with lime juice\n6. Mix sour cream with garlic and lime zest\n7. Break fish into chunks\n8. Assemble tacos with all components",
          difficulty: "Medium"
        },
        {
          name: "Creamy Mushroom Pasta",
          ingredients: ["pasta", "mushrooms", "cream", "garlic", "parmesan", "butter", "herbs", "onion"],
          cookingTime: "25 mins",
          instructions: "1. Cook pasta in salted water\n2. Slice mushrooms and dice onion\n3. Melt butter in a large pan\n4. Sauté mushrooms until golden\n5. Add onion and garlic, cook until soft\n6. Pour in cream and simmer\n7. Add cooked pasta and parmesan\n8. Stir in herbs\n9. Season to taste",
          difficulty: "Medium"
        },
        {
          name: "Sweet Potato Buddha Bowl",
          ingredients: ["sweet potato", "quinoa", "kale", "chickpeas", "tahini", "lemon", "garlic", "olive oil"],
          cookingTime: "35 mins",
          instructions: "1. Cube sweet potatoes and roast with oil (25 mins)\n2. Cook quinoa according to package\n3. Massage kale with olive oil\n4. Roast chickpeas with spices\n5. Make tahini sauce: blend tahini, lemon, garlic\n6. Assemble bowls with all components\n7. Drizzle with sauce\n8. Season to taste",
          difficulty: "Easy"
        },
        {
          name: "One-Pan Mexican Rice",
          ingredients: ["rice", "black beans", "corn", "tomatoes", "onion", "garlic", "spices", "broth"],
          cookingTime: "30 mins",
          instructions: "1. Sauté onion and garlic in oil\n2. Add rice and toast slightly\n3. Add spices and stir\n4. Pour in broth and tomatoes\n5. Add beans and corn\n6. Bring to boil, then simmer\n7. Cook covered for 20 minutes\n8. Let rest 5 minutes\n9. Fluff with fork before serving",
          difficulty: "Easy"
        },
        {
          name: "Quick Curry",
          ingredients: ["coconut milk", "curry paste", "vegetables", "protein", "rice", "garlic", "ginger", "oil"],
          cookingTime: "25 mins",
          instructions: "1. Cook rice according to package\n2. Heat oil in a large pan\n3. Sauté garlic and ginger\n4. Add curry paste and fry briefly\n5. Add protein and cook through\n6. Pour in coconut milk\n7. Add vegetables\n8. Simmer until vegetables are tender\n9. Serve over rice",
          difficulty: "Medium"
        },
        {
          name: "Breakfast Burrito",
          ingredients: ["eggs", "tortillas", "cheese", "potatoes", "beans", "salsa", "onion", "bell pepper"],
          cookingTime: "30 mins",
          instructions: "1. Dice and cook potatoes until crispy\n2. Sauté onion and peppers\n3. Scramble eggs\n4. Warm beans\n5. Heat tortillas\n6. Layer ingredients in tortilla\n7. Add cheese and salsa\n8. Roll up tightly\n9. Optional: grill for crispy exterior",
          difficulty: "Medium"
        },
        {
          name: "Vegetable Soup",
          ingredients: ["carrots", "celery", "onion", "potatoes", "vegetable broth", "garlic", "herbs", "tomatoes"],
          cookingTime: "40 mins",
          instructions: "1. Dice all vegetables\n2. Heat oil in large pot\n3. Sauté onion, carrots, celery\n4. Add garlic and herbs\n5. Pour in broth and tomatoes\n6. Add potatoes\n7. Bring to boil, then simmer\n8. Cook until vegetables are tender\n9. Season to taste",
          difficulty: "Easy"
        },
        {
          name: "Asian Noodle Stir-Fry",
          ingredients: ["noodles", "vegetables", "soy sauce", "garlic", "ginger", "oil", "sesame oil", "protein"],
          cookingTime: "20 mins",
          instructions: "1. Cook noodles according to package\n2. Prepare sauce: mix soy sauce, sesame oil\n3. Heat oil in wok or large pan\n4. Cook protein if using\n5. Add garlic and ginger\n6. Stir-fry vegetables\n7. Add noodles and sauce\n8. Toss until well combined\n9. Serve hot",
          difficulty: "Medium"
        },
        {
          name: "5-Minute Microwave Oatmeal",
          ingredients: ["oats", "milk", "banana", "honey", "cinnamon"],
          cookingTime: "5 mins",
          instructions: "1. Mix oats and milk in a microwave-safe bowl\n2. Microwave for 2 minutes\n3. Slice banana\n4. Add honey and cinnamon\n5. Stir and enjoy",
          difficulty: "Very Easy"
        },
        {
          name: "Simple Tuna Sandwich",
          ingredients: ["bread", "tuna", "mayonnaise", "onion", "celery"],
          cookingTime: "10 mins",
          instructions: "1. Drain tuna\n2. Mix with mayonnaise\n3. Finely chop onion and celery\n4. Combine all ingredients\n5. Spread on bread",
          difficulty: "Very Easy"
        },
        {
          name: "Quick Quesadilla",
          ingredients: ["tortillas", "cheese", "beans", "salsa"],
          cookingTime: "10 mins",
          instructions: "1. Heat pan over medium heat\n2. Place tortilla in pan\n3. Add cheese and beans\n4. Top with second tortilla\n5. Flip when golden\n6. Serve with salsa",
          difficulty: "Very Easy"
        },
        {
          name: "3-Ingredient Pancakes",
          ingredients: ["banana", "eggs", "oats"],
          cookingTime: "15 mins",
          instructions: "1. Mash banana\n2. Mix with eggs and oats\n3. Heat pan with oil\n4. Pour small circles of batter\n5. Flip when bubbles form",
          difficulty: "Very Easy"
        },
        {
          name: "Simple Greek Salad",
          ingredients: ["cucumber", "tomatoes", "olives", "feta cheese", "olive oil"],
          cookingTime: "10 mins",
          instructions: "1. Chop cucumber and tomatoes\n2. Add olives\n3. Crumble feta cheese\n4. Drizzle with olive oil\n5. Season with salt and pepper",
          difficulty: "Very Easy"
        },
        {
          name: "Microwave Baked Potato",
          ingredients: ["potato", "butter", "salt", "pepper"],
          cookingTime: "8 mins",
          instructions: "1. Wash potato and prick with fork\n2. Microwave 4 minutes\n3. Turn over\n4. Microwave 4 more minutes\n5. Top with butter and seasonings",
          difficulty: "Very Easy"
        },
        {
          name: "Easy Bean Dip",
          ingredients: ["beans", "salsa", "cheese", "garlic powder"],
          cookingTime: "5 mins",
          instructions: "1. Mash beans\n2. Mix in salsa\n3. Add cheese\n4. Season with garlic powder\n5. Microwave if desired",
          difficulty: "Very Easy"
        },
        {
          name: "2-Minute Scrambled Eggs",
          ingredients: ["eggs", "butter", "salt", "pepper"],
          cookingTime: "2 mins",
          instructions: "1. Beat eggs with salt and pepper\n2. Melt butter in pan\n3. Add eggs\n4. Stir until set\n5. Serve immediately",
          difficulty: "Very Easy"
        },
        {
          name: "Quick Apple Snack",
          ingredients: ["apple", "peanut butter", "honey", "cinnamon"],
          cookingTime: "5 mins",
          instructions: "1. Slice apple\n2. Spread with peanut butter\n3. Drizzle honey\n4. Sprinkle cinnamon",
          difficulty: "Very Easy"
        },
        {
          name: "Simple Avocado Toast",
          ingredients: ["bread", "avocado", "salt", "pepper", "olive oil"],
          cookingTime: "5 mins",
          instructions: "1. Toast bread\n2. Mash avocado\n3. Spread on toast\n4. Drizzle with olive oil\n5. Season with salt and pepper",
          difficulty: "Very Easy"
        },
        {
          name: "Quick Rice Bowl",
          ingredients: ["rice", "vegetables", "soy sauce", "sesame oil"],
          cookingTime: "15 mins",
          instructions: "1. Cook rice\n2. Steam vegetables\n3. Combine in bowl\n4. Add soy sauce and sesame oil\n5. Mix and serve",
          difficulty: "Very Easy"
        },
        {
          name: "Easy Fruit Smoothie",
          ingredients: ["banana", "berries", "yogurt", "honey", "milk"],
          cookingTime: "5 mins",
          instructions: "1. Add all ingredients to blender\n2. Blend until smooth\n3. Add more milk if too thick\n4. Taste and adjust sweetness",
          difficulty: "Very Easy"
        },
        {
          name: "Simple Caprese",
          ingredients: ["tomatoes", "mozzarella", "basil", "olive oil", "balsamic"],
          cookingTime: "5 mins",
          instructions: "1. Slice tomatoes and mozzarella\n2. Arrange on plate\n3. Add basil leaves\n4. Drizzle with oil and balsamic\n5. Season with salt",
          difficulty: "Very Easy"
        },
        {
          name: "Quick Hummus Toast",
          ingredients: ["bread", "hummus", "cucumber", "olive oil", "pepper"],
          cookingTime: "5 mins",
          instructions: "1. Toast bread\n2. Spread hummus\n3. Slice cucumber\n4. Add to toast\n5. Drizzle with oil and season",
          difficulty: "Very Easy"
        },
        {
          name: "Easy Yogurt Parfait",
          ingredients: ["yogurt", "granola", "honey", "berries"],
          cookingTime: "5 mins",
          instructions: "1. Layer yogurt in glass\n2. Add granola\n3. Add berries\n4. Drizzle with honey\n5. Repeat layers if desired",
          difficulty: "Very Easy"
        },
        {
          name: "Garlic Butter Pasta",
          ingredients: ["pasta", "butter", "garlic", "salt", "pepper"],
          cookingTime: "15 mins",
          instructions: "1. Cook pasta in salted water\n2. Melt butter in a pan\n3. Add minced garlic, cook 1 minute\n4. Drain pasta, reserve some water\n5. Toss pasta with garlic butter\n6. Add pasta water if needed\n7. Season with salt and pepper",
          difficulty: "Very Easy"
        },
        {
          name: "Simple Rice and Vegetables",
          ingredients: ["rice", "frozen vegetables", "oil", "salt"],
          cookingTime: "20 mins",
          instructions: "1. Cook rice according to package\n2. Heat oil in a pan\n3. Add frozen vegetables\n4. Cook until heated through\n5. Season and combine with rice",
          difficulty: "Very Easy"
        },
        {
          name: "Basic Tomato Soup",
          ingredients: ["canned tomatoes", "onion", "garlic", "oil", "salt"],
          cookingTime: "20 mins",
          instructions: "1. Sauté diced onion and garlic\n2. Add canned tomatoes\n3. Simmer for 15 minutes\n4. Blend until smooth\n5. Season to taste",
          difficulty: "Easy"
        },
        {
          name: "Simple Bean Salad",
          ingredients: ["canned beans", "onion", "oil", "vinegar", "salt"],
          cookingTime: "10 mins",
          instructions: "1. Drain and rinse beans\n2. Dice onion finely\n3. Mix oil and vinegar\n4. Combine all ingredients\n5. Season to taste",
          difficulty: "Very Easy"
        },
        {
          name: "Quick Noodle Soup",
          ingredients: ["noodles", "broth", "frozen vegetables", "salt"],
          cookingTime: "15 mins",
          instructions: "1. Bring broth to boil\n2. Add noodles\n3. Add frozen vegetables\n4. Cook until noodles are done\n5. Season to taste",
          difficulty: "Very Easy"
        },
        {
          name: "Basic Fried Rice",
          ingredients: ["cooked rice", "oil", "soy sauce", "frozen vegetables"],
          cookingTime: "15 mins",
          instructions: "1. Heat oil in a pan\n2. Add cold cooked rice\n3. Add frozen vegetables\n4. Stir in soy sauce\n5. Cook until hot",
          difficulty: "Easy"
        },
        {
          name: "Simple Pasta Salad",
          ingredients: ["pasta", "oil", "vinegar", "salt", "pepper"],
          cookingTime: "15 mins",
          instructions: "1. Cook pasta, then cool\n2. Mix oil and vinegar\n3. Toss with pasta\n4. Season to taste\n5. Chill before serving",
          difficulty: "Very Easy"
        },
        {
          name: "Pantry Chickpea Curry",
          ingredients: ["canned chickpeas", "canned tomatoes", "curry powder", "onion", "oil"],
          cookingTime: "20 mins",
          instructions: "1. Sauté diced onion\n2. Add curry powder\n3. Add chickpeas and tomatoes\n4. Simmer 15 minutes\n5. Season to taste",
          difficulty: "Easy"
        },
        {
          name: "Quick Tomato Pasta",
          ingredients: ["pasta", "canned tomatoes", "garlic", "oil", "salt"],
          cookingTime: "20 mins",
          instructions: "1. Cook pasta\n2. Heat oil and garlic\n3. Add tomatoes\n4. Simmer 10 minutes\n5. Combine with pasta",
          difficulty: "Very Easy"
        },
        {
          name: "Basic Potato Soup",
          ingredients: ["potatoes", "onion", "broth", "salt", "pepper"],
          cookingTime: "30 mins",
          instructions: "1. Dice potatoes and onion\n2. Simmer in broth\n3. Cook until tender\n4. Mash some potatoes\n5. Season to taste",
          difficulty: "Easy"
        }
      ];

      // First, calculate match percentage for each recipe
      const recipesWithMatches = recipeDatabase.map(recipe => {
        const matchingIngredients = recipe.ingredients.filter(ingredient =>
          pantryItems.some(item => item.includes(ingredient.toLowerCase()))
        );
        const matchPercentage = (matchingIngredients.length / recipe.ingredients.length) * 100;
        return { ...recipe, matchPercentage };
      });

      // Filter recipes with at least 50% matching ingredients
      let possibleRecipes = recipesWithMatches.filter(recipe => recipe.matchPercentage >= 50);

      // If we don't have enough recipes with 50% matches, add more until we have at least 3
      if (possibleRecipes.length < 3) {
        const remainingRecipes = recipesWithMatches
          .filter(recipe => recipe.matchPercentage < 50)
          .sort((a, b) => b.matchPercentage - a.matchPercentage);
        
        possibleRecipes = [...possibleRecipes, ...remainingRecipes].slice(0, 3);
      }

      // Sort by match percentage
      possibleRecipes.sort((a, b) => b.matchPercentage - a.matchPercentage);

      // Take the top 3-4 recipes
      const selectedRecipes = possibleRecipes.slice(0, Math.min(4, possibleRecipes.length));

      setRecipes(selectedRecipes);
      toast.success(`Found ${selectedRecipes.length} recipes matching your pantry items!`);
    } catch (error) {
      console.error("Error generating recipes:", error);
      toast.error("Failed to generate recipes");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 via-cream-50 to-mint-50">
      <Navbar user={user} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-16">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-lg mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Recipe Generator
          </h1>
          <p className="text-gray-600">
            Click the button below to discover recipes that can be made using the items present in your pantry.
          </p>
        </div>

        <div className="text-center mb-12">
          <button
            onClick={generateRecipes}
            disabled={loading}
            className="bg-sage-600 hover:bg-sage-700 text-white px-8 py-4 rounded-lg 
              text-lg font-semibold transform transition duration-200 hover:scale-105 
              shadow-lg flex items-center gap-2 mx-auto"
          >
            <FaUtensils />
            {loading ? "Generating..." : "Generate Recipes"}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe, index) => (
            <div
              key={index}
              className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">{recipe.name}</h3>
              
              <div className="flex items-center gap-2 text-sage-600 mb-4">
                <FaClock />
                <span>{recipe.cookingTime}</span>
                <span className="mx-2">•</span>
                <span>{recipe.difficulty}</span>
              </div>

              <div className="mb-4">
                <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <FaList />
                  Ingredients:
                </h4>
                <ul className="list-disc list-inside text-gray-600">
                  {recipe.ingredients.map((ingredient, i) => (
                    <li key={i} className={
                      pantryItems.some(item => item.includes(ingredient.toLowerCase()))
                        ? "text-sage-600"
                        : "text-red-500"
                    }>
                      {ingredient}
                      {pantryItems.some(item => item.includes(ingredient.toLowerCase())) 
                        ? " (available)" 
                        : " (missing)"}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Instructions:</h4>
                <p className="text-gray-600 whitespace-pre-line">
                  {recipe.instructions}
                </p>
              </div>
            </div>
          ))}
      </div>
      </main>
      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default GenerateRecipes;
