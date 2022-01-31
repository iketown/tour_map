export const eventFormValidator = (values: Partial<EventRecord>) => {
  const errors: { [key: string]: string } = {};
  if (!values.place || !values.time_zone)
    errors.place = "Please select a Location";
  const starts_at = values.starts_at && new Date(values.starts_at);
  if (!starts_at || !starts_at.getTime())
    errors.starts_at = "Please select a date";
  return errors;
};
