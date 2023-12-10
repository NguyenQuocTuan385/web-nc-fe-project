import * as yup from "yup";
import { AnyObject, Maybe, Message } from "yup/lib/types";
import freeEmailDomains from "free-email-domains";
import psl from "psl";
import moment from "moment";

export const isValidBusinessEmail = (value: string, isDomain: boolean = false) => {
  if (value && value.includes("@") || isDomain) {
    var parsed = psl.parse(value.toLocaleLowerCase().split('@').pop()) as psl.ParsedDomain
    if (parsed?.domain && freeEmailDomains.includes(parsed?.domain)) {
      return false
    }
  }
  return true
}

yup.addMethod<yup.StringSchema>(yup.string, 'businessEmail', function (msg) {
  return this.test("isValidBusinessEmail", msg, function (value) {
    const { path, createError } = this;
    if (!isValidBusinessEmail(value)) {
      return createError({ path, message: msg ?? "Please use business email to register" })
    }
    return true
  })
})

yup.addMethod<yup.NumberSchema>(yup.number, 'empty', function () {
  return this.transform((val, originalVal) => originalVal === '' ? null : val)
})

yup.addMethod<yup.DateSchema>(yup.date, 'startTime', function (msg?: { lessThan?: Message<{}>, between?: Message<{}>}) {
  return this.test('isValidStartTime', msg, function (value) {
    const { path, createError } = this;
    const options: any = this.options
    const index = options?.index || 0
    const scenes = (options?.from?.[1]?.value?.scenes || []).filter((item: any, i: number) =>
      i !== index &&
      moment(item.startTime).isValid() &&
      moment(item.endTime).isValid()
    )
    const startTime = moment(value)
    const endTime = moment(this.parent.endTime)
    
    if (startTime.isValid() && startTime.isSameOrAfter(endTime)) {
      return createError({
        path,
        params: {
          lessThan: endTime.format('mm:ss'),
        },
        message: msg?.lessThan ?? function(params) {
          return `End time must be less than ${params.lessThan}`
        }
      })
    }
    const duplicate = scenes.find(item => startTime.isSameOrAfter(moment(item.startTime)) && startTime.isSameOrBefore(moment(item.endTime)))
    if (duplicate) {
      return createError({
        path,
        params: {
          lessThan: moment(duplicate.startTime).format('mm:ss'),
          greaterThan: moment(duplicate.endTime).format('mm:ss')
        },
        message: msg?.between ?? function(params) {
          return `Start time must be less than ${params.lessThan} or greater than ${params.greaterThan}`
        }
      })
    }
    return true
  })
})

yup.addMethod<yup.DateSchema>(yup.date, 'endTime', function (msg?: { moreThan?: Message<{}>, between?: Message<{}>}) {
  return this.test('isValidEndTime', msg, function (value) {
    const { path, createError } = this;
    const options: any = this.options
    const index = options?.index || 0
    const scenes = (options?.from?.[1]?.value?.scenes || []).filter((item: any, i: number) =>
      i !== index &&
      moment(item.startTime).isValid() &&
      moment(item.endTime).isValid()
    )
    const startTime = moment(this.parent.startTime)
    const endTime = moment(value)
    if (startTime.isValid() && startTime.isSameOrAfter(endTime)) {
      return createError({
        path,
        params: {
          moreThan: startTime.format('mm:ss'),
        },
        message: msg?.moreThan ?? function(params) {
          return `End time must be greater than ${params.moreThan}`
        }
      })
    }
    const duplicate = scenes.find(item => endTime.isSameOrAfter(moment(item.startTime)) && endTime.isSameOrBefore(moment(item.endTime)))
    if (duplicate) {
      return createError({
        path,
        params: {
          lessThan: moment(duplicate.startTime).format('mm:ss'),
          greaterThan: moment(duplicate.endTime).format('mm:ss')
        },
        message: msg?.between ?? function(params) {
          return `End time must be less than ${params.lessThan} or greater than ${params.greaterThan}`
        }
      })
    }
    return true
  })
})

declare module 'yup' {
  interface StringSchema<
    TType extends Maybe<string> = string | undefined,
    TContext extends AnyObject = AnyObject,
    TOut extends TType = TType,
  > extends yup.BaseSchema<TType, TContext, TOut> {
    businessEmail(msg?: Message<{}>): StringSchema<TType, TContext>;
  }
  interface NumberSchema<
    TType extends Maybe<number> = number | undefined,
    TContext extends AnyObject = AnyObject,
    TOut extends TType = TType
  > extends yup.BaseSchema<TType, TContext, TOut> {
    empty(): NumberSchema<TType, TContext>;
  }
  interface DateSchema<TType extends Maybe<Date>, TContext extends AnyObject = AnyObject, TOut extends TType = TType> extends yup.BaseSchema<TType, TContext, TOut> {
    endTime(msg?: { moreThan?: Message<{}>, between?: Message<{}>}): DateSchema<TType, TContext>;
    startTime(msg?: { lessThan?: Message<{}>, between?: Message<{}>}): DateSchema<TType, TContext>;
  }
}

export default yup;