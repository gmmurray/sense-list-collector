import * as React from 'react';

import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';

import TextField from '@mui/material/TextField';

export type CreatableAutocompleteOption = {
  inputValue?: string;
  value: string;
};

const filter = createFilterOptions<CreatableAutocompleteOption>();

export type CreatableAutocompleteProps = {
  value?: string;
  onChange: (value: CreatableAutocompleteOption | null) => any;
  onCreate: (value: CreatableAutocompleteOption) => any;
  options: CreatableAutocompleteOption[];
  id: string;
  name: string;
  label: string;
};

const CreatableAutocomplete = ({
  value,
  onChange,
  onCreate,
  options,
  id,
  name,
  label,
}: CreatableAutocompleteProps) => {
  return (
    <Autocomplete
      value={value}
      onChange={(event, newValue) => {
        if (typeof newValue === 'string') {
          onChange({
            value: newValue,
          });
        } else if (newValue && newValue.inputValue) {
          // Create a new value from the user input
          const newOption = { value: newValue.inputValue };
          onCreate(newOption);
          onChange(newOption);
        } else {
          onChange(newValue);
        }
      }}
      filterOptions={(choices, params) => {
        const filtered = filter(choices, params);

        const { inputValue } = params;
        // Suggest the creation of a new value
        const isExisting = choices.some(option => inputValue === option.value);
        if (inputValue !== '' && !isExisting) {
          filtered.push({
            inputValue,
            value: `Add "${inputValue}"`,
          });
        }

        return filtered;
      }}
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      id={id}
      options={options}
      getOptionLabel={option => {
        // Value selected with enter, right from the input
        if (typeof option === 'string') {
          return option;
        }
        // Add "xxx" option created dynamically
        if (option.inputValue) {
          return option.inputValue;
        }
        // Regular option
        return option.value;
      }}
      renderOption={(props, option) => <li {...props}>{option.value}</li>}
      freeSolo
      renderInput={params => (
        <TextField {...params} label={label} name={name} variant="standard" />
      )}
      fullWidth
    />
  );
};

export default CreatableAutocomplete;
