import {
  NavItem,
  routes
} from "routers/routes";
import { Category, FactCheck, FormatListBulleted, GTranslate, HelpOutline, Lightbulb, LiveHelp, Mail, Paid, Person, Settings, Key, TableView, Work, NotificationsActive, Webhook } from '@mui/icons-material';
import SolutionCategory from "./SolutionCategory";
import Solution from "./Solution";
import SolutionCategoryHome from "./SolutionCategoryHome";
import Attribute from "./Attribute";
import Translation from "./Translation";
import Target from "./Target";
import QuotaTable from "./QuotaTable";
import EmailTemplate from "./EmailTemplate";
import EmailReminder from "./EmailReminder";
import ConfigPage from "./ConfigPage";
import Project from "./Project";
import User from "./User";
import CustomQuestionType from "./CustomQuestionType";
import PaymentPage from "./Payment";
import PlanModule from "./Plan";
import ApiKeyPage from "./ApiKey";
import WebhookPage from "./WebHook";

export const adminRouter: NavItem[] = [
  {
    path: routes.admin.user.root,
    name: 'User',
    icon: Person,
    component: User,
    layout: "/admin"
  },
  {
    path: routes.admin.project.root,
    name: 'Project',
    icon: Work,
    component: Project,
    layout: "/admin"
  },
  {
    path: routes.admin.payment.root,
    name: 'Order',
    icon: Paid,
    component: PaymentPage,
    layout: "/admin"
  },
  {
    path: routes.admin.solution.root,
    name: 'Solution',
    icon: Lightbulb,
    component: Solution,
    layout: "/admin"
  },
  {
    path: routes.admin.solutionCategory.root,
    name: 'Solution category',
    icon: Category,
    component: SolutionCategory,
    layout: "/admin"
  },
  {
    path: routes.admin.solutionCategoryHome.root,
    name: 'Solution category home',
    icon: Category,
    component: SolutionCategoryHome,
    layout: "/admin"
  },
  {
    path: routes.admin.plan.root,
    name: 'Plan',
    icon: FactCheck,
    component: PlanModule,
    layout: "/admin"
  },
  {
    path: routes.admin.attribute.root,
    name: 'Attribute',
    icon: FormatListBulleted,
    component: Attribute,
    layout: "/admin"
  },
  {
    path: routes.admin.translation.root,
    name: 'Translation',
    icon: GTranslate,
    component: Translation,
    layout: "/admin"
  },
  {
    path: routes.admin.target.question.root,
    name: 'Target',
    icon: LiveHelp,
    component: Target,
    layout: "/admin"
  },
  {
    path: routes.admin.quotaTable.root,
    name: 'Quota table',
    icon: TableView,
    component: QuotaTable,
    layout: "/admin"
  },
  {
    path: routes.admin.emailTemplate.root,
    name: 'Email template',
    icon: Mail,
    component: EmailTemplate,
    layout: "/admin"
  },
  {
    path: routes.admin.emailReminder.root,
    name: 'Email reminder',
    icon: NotificationsActive,
    component: EmailReminder,
    layout: "/admin"
  },
  {
    path: routes.admin.customQuestionType.root,
    name: 'Custom question type',
    icon: HelpOutline,
    component: CustomQuestionType,
    layout: "/admin"
  },
  {
    path: routes.admin.config.root,
    name: 'Config',
    icon: Settings,
    component: ConfigPage,
    layout: "/admin"
  },
  {
    path: routes.admin.apikey.root,
    name: 'API Key',
    icon: Key,
    component: ApiKeyPage,
    layout: "/admin"
  },
  {
    path: routes.admin.webhook.root,
    name: 'Webhook',
    icon: Webhook,
    component: WebhookPage,
    layout: "/admin"
  }
]