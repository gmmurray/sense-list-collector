import {
  FormControl,
  FormControlProps,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  TextFieldProps,
} from '@mui/material';

import { FormikContextType } from 'formik';

export function FormikTextField<T>({
  formik,
  name,
  label,
  inputProps,
}: {
  formik: FormikContextType<T>;
  name: string;
  label: string;
  inputProps: TextFieldProps;
}) {
  const { values, touched, errors, handleChange } = formik;

  const value = values[name as keyof typeof values];
  const error =
    touched[name as keyof typeof touched] &&
    !!errors[name as keyof typeof errors];
  const helperText =
    touched[name as keyof typeof touched] &&
    (errors[name as keyof typeof errors] as string | undefined);

  return (
    <TextField
      {...inputProps}
      id={name}
      name={name}
      label={label}
      value={value}
      onChange={handleChange}
      error={error}
      helperText={helperText}
    />
  );
}

export function FormikSelect<T>({
  formik,
  name,
  label,
  options,
  inputProps,
}: {
  formik: FormikContextType<T>;
  name: string;
  label: string;
  options: { name: string; value: string }[];
  inputProps: FormControlProps;
}) {
  const { values, touched, errors, handleChange } = formik;

  const value = values[name as keyof typeof values];
  const error =
    touched[name as keyof typeof touched] &&
    !!errors[name as keyof typeof errors];
  const helperText =
    touched[name as keyof typeof touched] &&
    (errors[name as keyof typeof errors] as string | undefined);

  return (
    <FormControl {...inputProps} error={error}>
      <InputLabel id={`${name}-label`}>{label}</InputLabel>
      <Select
        id={name}
        name={name}
        label={label}
        value={value}
        onChange={handleChange}
      >
        <MenuItem value={undefined}>select</MenuItem>
        {options.map((option, key) => (
          <MenuItem key={key} value={option.value}>
            {option.name}
          </MenuItem>
        ))}
      </Select>
      {!!helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
}
