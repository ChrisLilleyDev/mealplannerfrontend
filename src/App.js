import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Public from './components/Public'
import Login from './features/auth/Login'
import DashLayout from './components/DashLayout'
import Welcome from './features/auth/Welcome'
import UsersList from './features/users/UsersList'
import MealsList from './features/meals/MealsList'
import MealplansList from './features/mealplans/MealplansList'

function App() {
  return (
    <Routes>
      <Route path='/' element={<Layout />}>

        <Route index element={<Public />} />
        <Route path='login' element={<Login />} />

        <Route path='dash' element={<DashLayout />}>

          <Route index element={<Welcome />} />
          
          <Route path='mealplans'>
            <Route index element={<MealplansList />} />
          </Route>        

          <Route path='meals'>
            <Route index element={<MealsList />} />
          </Route>        

          <Route path='users'>
            <Route index element={<UsersList />} />
          </Route>        

        </Route>

      </Route>
    </Routes>
  );
}

export default App;
