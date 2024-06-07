import { Routes, Route } from 'react-router-dom'
import { ROLES } from './config/roles'
import { Public } from './components/Public'
import { Layout } from './components/Layout'
import { DashLayout } from './components/DashLayout'
import { Login } from './features/auth/Login'
import { Welcome } from './features/auth/Welcome'
import { Prefetch } from './features/auth/Prefetch'
import { PersistLogin } from './features/auth/PersistLogin'
import { RequireAuth } from './features/auth/RequireAuth'

import { ConstraintsList } from './features/constraints/ConstraintsList'
import { EditConstraint } from './features/constraints/EditConstraint'
import { NewConstraint } from './features/constraints/NewConstraint'
import { IngredientsList } from './features/ingredients/IngredientsList'
import { EditIngredient } from './features/ingredients/EditIngredient'
import { NewIngredient } from './features/ingredients/NewIngredient'
import { InventoriesList } from './features/inventories/InventoriesList'
import { EditInventory } from './features/inventories/EditInventory'
import { NewInventory } from './features/inventories/NewInventory'
import { MealplansList } from './features/mealplans/MealplansList'
import { EditMealplan } from './features/mealplans/EditMealplan'
import { NewMealplan } from './features/mealplans/NewMealplan'
import { MealsList } from './features/meals/MealsList'
import { EditMeal } from './features/meals/EditMeal'
import { NewMeal } from './features/meals/NewMeal'
import { PlantemplatesList } from './features/plantemplates/PlantemplatesList'
import { EditPlantemplate } from './features/plantemplates/EditPlantemplate'
import { NewPlantemplate } from './features/plantemplates/NewPlantemplate'
import { UsersList } from './features/users/UsersList'
import { EditUser } from './features/users/EditUser'
import { NewUserForm } from './features/users/NewUserForm'

export function App() {
  return (
    <Routes>
      <Route path='/' element={<Layout />}>

        <Route index element={<Public />} />
        <Route path='login' element={<Login />} />

        <Route element={<PersistLogin />}>
          <Route element={<RequireAuth allowedRoles={[...Object.values(ROLES)]} />}>
            <Route element={<Prefetch />}>
              <Route path='dash' element={<DashLayout />}>

                <Route index element={<Welcome />} />

                <Route path='constraints'>
                  <Route index element={<ConstraintsList />} />
                  <Route path=':id' element={<EditConstraint />} />
                  <Route path='new' element={<NewConstraint />} />
                </Route>

                <Route path='ingredients'>
                  <Route index element={<IngredientsList />} />
                  <Route path=':id' element={<EditIngredient />} />
                  <Route path='new' element={<NewIngredient />} />
                </Route>

                <Route path='inventories'>
                  <Route index element={<InventoriesList />} />
                  <Route path=':id' element={<EditInventory />} />
                  <Route path='new' element={<NewInventory />} />
                </Route>

                <Route path='mealplans'>
                  <Route index element={<MealplansList />} />
                  <Route path=':id' element={<EditMealplan />} />
                  <Route path='new' element={<NewMealplan />} />
                </Route>

                <Route path='meals'>
                  <Route index element={<MealsList />} />
                  <Route path=':id' element={<EditMeal />} />
                  <Route path='new' element={<NewMeal />} />
                </Route>

                <Route path='plantemplates'>
                  <Route index element={<PlantemplatesList />} />
                  <Route path=':id' element={<EditPlantemplate />} />
                  <Route path='new' element={<NewPlantemplate />} />
                </Route>

                <Route path='users'>
                  <Route index element={<UsersList />} />
                  <Route path=':id' element={<EditUser />} />
                  <Route path='new' element={<NewUserForm />} />
                </Route>

              </Route>
            </Route>
          </Route>
        </Route>

      </Route>
    </Routes>
  )
}