import { validate } from 'validate.js';
import { Ultis } from './Utils';
import { differenceInCalendarDays, differenceInMinutes } from 'date-fns';
import { BaseDA } from '../screen/baseDA';

export class ValidateType {
  static required = 1;
  static email = 2;
  static minLength = 3;
  static maxLength = 4;
  static number = 5;
  static phone = 6;
  static date = 7;
  static dateTime = 8;
  static earliestDate = 9;
  static latestDate = 10;
  static earliestTime = 11;
  static latestTime = 12;
  static equality = 13;
  static greaterThan = 14;
  static greaterThanOrEqualTo = 15;
  static lessThanOrEqualTo = 16;
  static lessThan = 17;
  static odd = 18;
  static even = 19;
  static url = 20;
  static async = 21;
}

const vietnamPhoneRegex =
  /^(\+84|0|)(3[2-9]|5[689]|7[06-9]|8[1-689]|9[0-46-9])[0-9]{7}$/;
export const validatePhoneNumber = (phoneNumber) => {
  return vietnamPhoneRegex.test(phoneNumber);
};

export async function validateForm({ list, formdata }) {
  validate.validators.customDate = customValidateDateTime;
  // validate.validators.myAsyncValidator = myAsyncValidator
  validate.options = { fullMessages: false };
  const myValidators = validateByType({ list: list });
  let res = validate(formdata, myValidators.validator);
  if (!res && Object.keys(myValidators.asyncValidator).length) {
    try {
      res = await validate.async(formdata, myValidators.asyncValidator);
    } catch (error) {
      res = error;
    }
  }

  return res;
}

function validateByType({ list = [] }) {
  let validator = {};
  let asyncValidator = {};
  list.forEach((e) => {
    let eValidateConfig = {};
    e.Validate?.forEach((el) => {
      switch (el.type) {
        case ValidateType.email:
          eValidateConfig.email = {
            message: el.message ?? 'Không đúng định dạng email',
          };
          break;
        case ValidateType.minLength:
          eValidateConfig.length = {
            ...(eValidateConfig.length ?? {}),
            minimum: el.value,
            tooShort: el.message ?? `Tối thiểu ${el.value} ký tự`,
          };
          break;
        case ValidateType.maxLength:
          eValidateConfig.length = {
            ...(eValidateConfig.length ?? {}),
            maximum: el.value,
            tooLong: el.message ?? `Tối da ${el.value} ký tự`,
          };
          break;
        case ValidateType.number:
          eValidateConfig.format = {
            pattern: '[0-9]+',
            flags: 'i',
            message: el.message ?? `Chỉ cho phép ký tự số`,
          };
          break;
        case ValidateType.phone:
          eValidateConfig.format = {
            pattern:
              '^(\+84|0)(3[2-9]|5[689]|7[06-9]|8[1-689]|9[0-46-9])[0-9]{7}$',
            flags: 'g',
            message: el.message ?? `Số điện thoại không hợp lệ`,
          };
          break;
        case ValidateType.date:
          eValidateConfig.customDate = {
            dateOnly: true,
            message: el.message ?? `Không đúng định dạng dd/mm/yyyy`,
          };
          break;
        case ValidateType.dateTime:
          eValidateConfig.customDate = {
            message: el.message ?? `Không đúng định dạng dd/mm/yyyy hh:mm`,
          };
          break;
        case ValidateType.earliestDate:
          eValidateConfig.customDate = {
            dateOnly: true,
            earliest: el.value,
            tooEarly:
              el.message ??
              `Không được trước ${Ultis.datetoString(new Date(el.value))}`,
          };
          break;
        case ValidateType.latestDate:
          eValidateConfig.customDate = {
            dateOnly: true,
            latest: el.value,
            tooLate:
              el.message ??
              `Không được sau ${Ultis.datetoString(new Date(el.value))}`,
          };
          break;
        case ValidateType.earliestTime:
          eValidateConfig.customDate = {
            earliest: el.value,
            tooEarly:
              el.message ??
              `Không được trước ${Ultis.datetoString(new Date(el.value))}`,
          };
          break;
        case ValidateType.latestTime:
          eValidateConfig.customDate = {
            latest: el.value,
            tooLate:
              el.message ??
              `Không được sau ${Ultis.datetoString(new Date(el.value))}`,
          };
          break;
        case ValidateType.greaterThan:
          eValidateConfig.numericality = {
            ...(eValidateConfig.numericality ?? {}),
            greaterThan: el.value,
            notGreaterThan: el.message ?? `Giá trị phải lớn hơn ${el.value}`,
          };
          break;
        case ValidateType.greaterThanOrEqualTo:
          eValidateConfig.numericality = {
            ...(eValidateConfig.numericality ?? {}),
            greaterThanOrEqualTo: el.value,
            notGreaterThan:
              el.message ?? `Giá trị không được nhỏ hơn ${el.value}`,
          };
          break;
        case ValidateType.lessThan:
          eValidateConfig.numericality = {
            ...(eValidateConfig.numericality ?? {}),
            lessThan: el.value,
            notLessThan: el.message ?? `Giá trị phải nhỏ hơn ${el.value}`,
          };
          break;
        case ValidateType.lessThanOrEqualTo:
          eValidateConfig.numericality = {
            ...(eValidateConfig.numericality ?? {}),
            lessThanOrEqualTo: el.value,
            notLessThanOrEqualTo:
              el.message ?? `Giá trị không được lớn hơn ${el.value}`,
          };
          break;
        case ValidateType.async:
          asyncValidator[e.Name] = { myAsyncValidator: { url: el.value } };
          break;
        default:
          break;
      }
    });
    validator[e.Name] = eValidateConfig;
  });
  return {
    validator: validator,
    asyncValidator: asyncValidator,
  };
}

function customValidateDateTime(value, options) {
  try {
    const parseValue =
      typeof value === 'string'
        ? Ultis.stringToDate(
            value,
            options.dateOnly ? 'dd/mm/yyyy' : 'dd/mm/yyyy hh:mm'
          )
        : new Date(value);
    if (options.earliest) {
      try {
        var _earliest =
          typeof options.earliest === 'string'
            ? Ultis.stringToDate(
                value,
                options.dateOnly ? 'dd/mm/yyyy' : 'dd/mm/yyyy hh:mm'
              )
            : new Date(options.earliest);
      } catch (error) {
        console.log(error);
      }
    }
    if (options.latest) {
      try {
        var _latest =
          typeof options.latest === 'string'
            ? Ultis.stringToDate(
                value,
                options.dateOnly ? 'dd/mm/yyyy' : 'dd/mm/yyyy hh:mm'
              )
            : new Date(options.latest);
      } catch (error) {
        console.log(error);
      }
    }
    if (isNaN(parseValue)) {
      return options.message;
    } else if (_earliest) {
      if (
        options.dateOnly &&
        differenceInCalendarDays(parseValue, _earliest) < 0
      ) {
        return options.tooEarly;
      } else if (
        !options.dateOnly &&
        differenceInMinutes(parseValue, _earliest) < 0
      ) {
        return options.tooEarly;
      }
    } else if (_latest) {
      if (
        options.dateOnly &&
        differenceInCalendarDays(parseValue, _latest) < 0
      ) {
        return options.tooLate;
      } else if (
        !options.dateOnly &&
        differenceInMinutes(parseValue, _latest) < 0
      ) {
        return options.tooLate;
      }
    }
  } catch (error) {
    return options.message;
  }
  return;
}

// async function myAsyncValidator(value, options) {
//     console.log("????????: ", value, " -----------: ", options)
//     if (options.url) {
//         const res = await BaseDA.post(options.url, {
//             body: { value: value }
//         })
//         if (res) {
//             if (res.code !== 200) return res.message
//         }
//     }
//     return undefined
// }
