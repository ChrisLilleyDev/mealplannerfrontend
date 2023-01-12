import { Outlet } from 'react-router-dom'
import DashHeader from './DashHeader'
import DashFooter from './DashFooter'

function DashLayout() {
  return (
    <>
      <DashHeader />
      <div className="DashContainer">
        <Outlet />
      </div>
      <DashFooter />
    </>
  )
}

export default DashLayout