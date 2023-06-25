import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Public from './components/Public'
import Login from './features/auth/Login'
import DashLayout from './components/DashLayout'
import Welcome from './features/auth/Welcome'
import UsersList from './features/users/UsersList'
import IngredientsList from './features/ingredients/IngredientsList'
import EditIngredient from './features/ingredients/EditIngredient'
import NewIngredient from './features/ingredients/NewIngredient'
import MealsList from './features/meals/MealsList'
import NewMeal from './features/meals/NewMeal'
import MealplansList from './features/mealplans/MealplansList'
import Prefetch from './features/auth/Prefetch'

function App() {
  return (
    <Routes>
      <Route path='/' element={<Layout />}>

        <Route index element={<Public />} />
        <Route path='login' element={<Login />} />
        
        <Route element={<Prefetch />}>
          <Route path='dash' element={<DashLayout />}>

            <Route index element={<Welcome />} />
            
            <Route path='mealplans'>
              <Route index element={<MealplansList />} />
            </Route>        

            <Route path='ingredients'>
              <Route index element={<IngredientsList />} />
              <Route path=':id' element={<EditIngredient />} />
              <Route path='new' element={<NewIngredient />} />
            </Route> 

            <Route path='meals'>
              <Route index element={<MealsList />} />
              <Route path='new' element={<NewMeal />} />
            </Route>        

            <Route path='users'>
              <Route index element={<UsersList />} />
            </Route>        

          </Route>
        </Route>

      </Route>
    </Routes>
  );
}

export default App;
