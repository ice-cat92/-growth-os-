import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppProvider } from '@/context/AppContext'
import { Layout } from '@/components/layout/Layout'
import { DashboardPage } from '@/components/dashboard/DashboardPage'
import { MainLinePage } from '@/components/progress/MainLinePage'
import { LearningPathPage } from '@/components/learning-path/LearningPathPage'
import { OutputPage } from '@/components/output/OutputPage'
import { ReviewPage } from '@/components/review/ReviewPage'
import { TodayPage } from '@/components/tasks/TodayPage'

function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/today" element={<TodayPage />} />
            <Route path="/progress" element={<MainLinePage />} />
            <Route path="/learning" element={<LearningPathPage />} />
            <Route path="/output" element={<OutputPage />} />
            <Route path="/review" element={<ReviewPage />} />
          </Route>
        </Routes>
      </AppProvider>
    </BrowserRouter>
  )
}

export default App
