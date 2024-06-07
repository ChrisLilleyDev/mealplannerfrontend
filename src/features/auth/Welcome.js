import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export function Welcome() {
    const { username, isAdmin } = useAuth()

    const date = new Date()
    const today = new Intl.DateTimeFormat('en-UK', {
        dateStyle: 'full',
        timeStyle: 'long'
    }).format(date)

    const content = (
        <section className="welcome">
            <p>{today}</p>
            <h1>Welcome {username}</h1>
            <p><Link to="/dash/constraints">View Constraints</Link></p>
            <p><Link to="/dash/constraints/new">Add New Constraint</Link></p>
            <p><Link to="/dash/ingredients">View Ingredients</Link></p>
            <p><Link to="/dash/ingredients/new">Add New Ingredient</Link></p>
            <p><Link to="/dash/inventories">View Inventories</Link></p>
            <p><Link to="/dash/inventories/new">Add New Inventory</Link></p>
            <p><Link to="/dash/mealplans">View Meal Plans</Link></p>
            <p><Link to="/dash/mealplans/new">Add New Meal Plan</Link></p>
            <p><Link to="/dash/meals">View Meals</Link></p>
            <p><Link to="/dash/meals/new">Add New Meal</Link></p>
            <p><Link to="/dash/plantemplates">View Plan Templates</Link></p>
            <p><Link to="/dash/plantemplates/new">Add New Plan Template</Link></p>
            {(isAdmin) && <p><Link to="/dash/users">View User Settings</Link></p>}
            {(isAdmin) && <p><Link to="/dash/users/new">Add New User</Link></p>}
        </section>
    )

    return content
}