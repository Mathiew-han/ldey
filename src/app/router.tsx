import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { SiteLayout } from './ui/SiteLayout'
import { AchievementsPage } from '../pages/achievements/AchievementsPage'
import { CenterPage } from '../pages/center/CenterPage'
import { ContactPage } from '../pages/contact/ContactPage'
import { DatabasePage } from '../pages/database/DatabasePage'
import { ExpertsPage } from '../pages/experts/ExpertsPage'
import { HomePage } from '../pages/home/HomePage'
import { StaffPage } from '../pages/staff/StaffPage'

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<SiteLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/experts" element={<ExpertsPage />} />
          <Route path="/staff" element={<StaffPage />} />
          <Route path="/center" element={<CenterPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/database" element={<DatabasePage />} />
          <Route path="/achievements" element={<AchievementsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
