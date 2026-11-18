
import {
  LayoutDashboard,
  Users,
  HardHat,
  Truck,
  CalendarDays,
  Wallet,
  ReceiptText,
  ChartNoAxesCombined,
  Star,
  Settings,
  User,
  BriefcaseBusiness,
  ClipboardList,
  CircleCheck,
  History,
  UserRound,
  FilePlus2,
  MessageSquare,
  Bot,
} from 'lucide-react'

export const navigation = {
  admin: [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Users', path: '/admin/users', icon: Users },
    { label: 'Operators', path: '/admin/operators', icon: HardHat },
    { label: 'Machines & GPS', path: '/admin/machines', icon: Truck },
    { label: 'Bookings', path: '/admin/bookings', icon: CalendarDays },
    { label: 'Bills & Invoices', path: '/admin/bills', icon: ReceiptText },
    {label: 'Operator bills & payment',path: '/admin/operator-bills-payments', icon: ReceiptText},
    { label: 'User Payments', path: '/admin/payments', icon: Wallet },

    { label: 'Reports', path: '/admin/reports', icon: ChartNoAxesCombined },

    { label: 'Feedback', path: '/admin/feedback', icon: Star },
    { label: 'Messages', path: '/admin/messages', icon: MessageSquare },
    { label: 'Bismi AI', path: '/admin/bismi-ai', icon: Bot },
    { label: 'Settings', path: '/admin/settings', icon: Settings },
  ],

  user: [
    { label: 'Dashboard', path: '/user', icon: LayoutDashboard },
    { label: 'My Bookings', path: '/user/bookings', icon: CalendarDays },
    { label: 'User Machines', path: '/user/UserMachines', icon: Truck },
    { label: 'User Payments', path: '/user/UserPayments', icon: Wallet },
    { label: 'My Bills', path: '/user/MyBills', icon: ReceiptText },
    { label: 'Messages', path: '/user/messages', icon: MessageSquare },
    { label: 'Bismi AI', path: '/user/bismi-ai', icon: Bot },
    { label: 'Feedback', path: '/user/UserFeedback', icon: Star },
    { label: 'My Profile', path: '/user/UserProfile', icon: UserRound },
  ],

  operator: [
    {
      label: "Dashboard",
      path: "/operator",
      icon: LayoutDashboard,
    },
    {
      label: "Assigned Jobs",
      path: "/operator/AssignedJobs",
      icon: BriefcaseBusiness,
    },
    
    {
      label: "Complete Jobs",
      path: "/operator/CompleteJobs",
      icon: CircleCheck,
    },
    {
      label: "Create Bill",
      path: "/operator/CreateBills",
      icon: FilePlus2,
    },
    {
      label: "My Earnings",
      path: "/operator/Myearnings",
      icon: FilePlus2,
    },
    {
      label: "Work History",
      path: "/operator/WorkHistory",
      icon: History,
    },
    {
      label: "Messages",
      path: "/operator/messages",
      icon: MessageSquare,
    },
    {
      label: "Bismi AI",
      path: "/operator/bismi-ai",
      icon: Bot,
    },
    {
      label: "My Profile",
      path: "/operator/OpProfile",
      icon: User,
    },
  ],
};