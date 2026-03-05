import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '@/views/DashboardView.vue'
import LogHistoryView from '@/views/LogHistoryView.vue'
import TaskQueueView from '@/views/TaskQueueView.vue'
import ProductionView from '@/views/ProductionView.vue'
import AlarmsView from '@/views/AlarmsView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'dashboard', component: DashboardView },
    { path: '/tasks', name: 'tasks', component: TaskQueueView },
    { path: '/production', name: 'production', component: ProductionView },
    { path: '/alarms', name: 'alarms', component: AlarmsView },
    { path: '/logs', name: 'logs', component: LogHistoryView }
  ]
})

export default router
