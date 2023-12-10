import { EPaymentMethod } from "models/general";
import { EPaymentStatus, Payment } from "models/payment";
import { Project, ProjectStatus } from "models/project";
import { routes } from "routers/routes";

export const getPayment = (payments: Payment[]) => {
  const _payments = (payments || []).filter(f => f.status !== EPaymentStatus.CANCEL)
  return [..._payments].sort((a, b) => b.id - a.id)[0]
}

export const authPreviewOrPayment = (project: Project, onRedirect: (route: string) => void, isAllowPayment: boolean) => {
  if (!project || !isAllowPayment) return
  const payment = getPayment(project.payments)
  switch (project.status) {
    case ProjectStatus.AWAIT_PAYMENT:
      if (!payment) return
      if ([EPaymentMethod.MAKE_AN_ORDER, EPaymentMethod.BANK_TRANSFER].includes(payment.paymentMethodId)) {
        if (payment?.userConfirm) onRedirect(routes.project.detail.paymentBilling.waiting)
        else onRedirect(routes.project.detail.paymentBilling.order)
      } else if ([EPaymentMethod.ONEPAY_GENERAL].includes(payment.paymentMethodId)) {
        if (payment.status === EPaymentStatus.FAILED) onRedirect(routes.project.detail.paymentBilling.onPayFail)
        else onRedirect(routes.project.detail.paymentBilling.onPayPending)
      }
      break;
    case ProjectStatus.IN_PROGRESS:
    case ProjectStatus.COMPLETED:
      onRedirect(routes.project.detail.paymentBilling.completed)
      break;
  }
}

export const authOrder = (project: Project, onRedirect: (route: string) => void, isAllowPayment: boolean) => {
  if (!project) return
  const payment = getPayment(project.payments)
  switch (project.status) {
    case ProjectStatus.DRAFT:
      onRedirect(routes.project.detail.paymentBilling.previewAndPayment.preview)
      break;
    case ProjectStatus.AWAIT_PAYMENT:
      if (!payment || !isAllowPayment) return
      if ([EPaymentMethod.MAKE_AN_ORDER, EPaymentMethod.BANK_TRANSFER].includes(payment.paymentMethodId)) {
        if (payment?.userConfirm) onRedirect(routes.project.detail.paymentBilling.waiting)
      } else if ([EPaymentMethod.ONEPAY_GENERAL].includes(payment.paymentMethodId)) {
        if (payment.status === EPaymentStatus.FAILED) onRedirect(routes.project.detail.paymentBilling.onPayFail)
        else onRedirect(routes.project.detail.paymentBilling.onPayPending)
      }
      break;
    case ProjectStatus.IN_PROGRESS:
    case ProjectStatus.COMPLETED:
      if (!isAllowPayment) return
      onRedirect(routes.project.detail.paymentBilling.completed)
      break;
  }
}

export const authWaiting = (project: Project, onRedirect: (route: string) => void, isAllowPayment: boolean) => {
  if (!project || !isAllowPayment) return
  const payment = getPayment(project.payments)
  switch (project.status) {
    case ProjectStatus.DRAFT:
      onRedirect(routes.project.detail.paymentBilling.previewAndPayment.preview)
      break;
    case ProjectStatus.AWAIT_PAYMENT:
      if (!payment) return
      if ([EPaymentMethod.MAKE_AN_ORDER, EPaymentMethod.BANK_TRANSFER].includes(payment.paymentMethodId)) {
        if (!payment?.userConfirm) onRedirect(routes.project.detail.paymentBilling.order)
      } else if ([EPaymentMethod.ONEPAY_GENERAL].includes(payment.paymentMethodId)) {
        if (payment.status === EPaymentStatus.FAILED) onRedirect(routes.project.detail.paymentBilling.onPayFail)
        else onRedirect(routes.project.detail.paymentBilling.onPayPending)
      }
      break;
    case ProjectStatus.IN_PROGRESS:
    case ProjectStatus.COMPLETED:
      onRedirect(routes.project.detail.paymentBilling.completed)
      break;
  }
}

export const authCompleted = (project: Project, onRedirect: (route: string) => void, isAllowPayment: boolean) => {
  if (!project || !isAllowPayment) return
  const payment = getPayment(project.payments)
  switch (project.status) {
    case ProjectStatus.DRAFT:
      onRedirect(routes.project.detail.paymentBilling.previewAndPayment.preview)
      break;
    case ProjectStatus.AWAIT_PAYMENT:
      if (!payment) return
      if ([EPaymentMethod.MAKE_AN_ORDER, EPaymentMethod.BANK_TRANSFER].includes(payment.paymentMethodId)) {
        if (payment?.userConfirm) onRedirect(routes.project.detail.paymentBilling.waiting)
        else onRedirect(routes.project.detail.paymentBilling.order)
      } else if ([EPaymentMethod.ONEPAY_GENERAL].includes(payment.paymentMethodId)) {
        if (payment.status === EPaymentStatus.FAILED) onRedirect(routes.project.detail.paymentBilling.onPayFail)
        else onRedirect(routes.project.detail.paymentBilling.onPayPending)
      }
      break;
  }
}

export const authPaymentFail = (project: Project, onRedirect: (route: string) => void, isAllowPayment: boolean) => {
  if (!project || !isAllowPayment) return
  const payment = getPayment(project.payments)
  switch (project.status) {
    case ProjectStatus.DRAFT:
      onRedirect(routes.project.detail.paymentBilling.previewAndPayment.preview)
      break;
    case ProjectStatus.AWAIT_PAYMENT:
      if (!payment) return
      if ([EPaymentMethod.MAKE_AN_ORDER, EPaymentMethod.BANK_TRANSFER].includes(payment.paymentMethodId)) {
        if (!payment?.userConfirm) onRedirect(routes.project.detail.paymentBilling.order)
      } else if ([EPaymentMethod.ONEPAY_GENERAL].includes(payment.paymentMethodId)) {
        if (payment.status === EPaymentStatus.FAILED) {
        } else onRedirect(routes.project.detail.paymentBilling.onPayPending)
      }
      break;
    case ProjectStatus.IN_PROGRESS:
    case ProjectStatus.COMPLETED:
      onRedirect(routes.project.detail.paymentBilling.completed)
      break;
  }
}