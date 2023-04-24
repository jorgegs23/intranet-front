import moment from 'moment';

const DATE_FORMAT = 'DD/MM/YYYY';

export const esFechaValida = (date: moment.MomentInput, format = DATE_FORMAT): boolean => {
  const d = moment(date, format);
  if (!d.isValid()) {
    return false;
  }
  return (d.isValid());
};

export const esFechaAnterior = (date: moment.MomentInput, format = DATE_FORMAT): boolean => {
  const d = moment(date, format);
  if (!d.isValid()) {
    return false;
  }
  return (d.isSameOrAfter(moment()));
};

export const esAnioAnterior = (date: moment.MomentInput, format = DATE_FORMAT): boolean => {
  const d = moment(date, format);
  if (!d.isValid()) {
    return false;
  }
  return d.year() < moment().year();
};
