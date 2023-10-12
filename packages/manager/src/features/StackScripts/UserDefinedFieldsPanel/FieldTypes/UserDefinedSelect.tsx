import { UserDefinedField } from '@linode/api-v4/lib/stackscripts';
import { Theme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import * as React from 'react';

import { Autocomplete } from 'src/components/Autocomplete/Autocomplete';
import { FormControlLabel } from 'src/components/FormControlLabel';
import { InputLabel } from 'src/components/InputLabel';
import { Notice } from 'src/components/Notice/Notice';
import { Radio } from 'src/components/Radio/Radio';

const useStyles = makeStyles((theme: Theme) => ({
  radioGroupLabel: {
    display: 'block',
    marginBottom: '4px',
  },
  root: {
    display: 'flex',
    flexDirection: 'column',
    margin: `${theme.spacing(3)} 0 0`,
    marginTop: '16px',
  },
}));

interface Props {
  error?: string;
  field: UserDefinedField;
  isOptional: boolean;
  updateFormState: (key: string, value: any) => void;
  value: string;
}

export const UserDefinedSelect = (props: Props) => {
  const classes = useStyles();

  const { error, field, isOptional, updateFormState, value } = props;

  const [oneof, setOneof] = React.useState<string[]>(field.oneof!.split(','));

  React.useEffect(() => {
    setOneof(field.oneof!.split(','));
  }, [field.oneof]);

  const handleSelectOneOf = (value: string) => {
    updateFormState(field.name, value);
  };

  const options = oneof.map((item) => ({ label: item }));

  if (oneof.length > 4) {
    return (
      <div>
        {error && <Notice spacingTop={8} text={error} variant="error" />}
        <Autocomplete
          disableClearable
          label={field.label}
          onChange={(_, option) => handleSelectOneOf(option.label)}
          options={options}
          value={options.find((option) => option.label === value)}
        />
      </div>
    );
  }
  return (
    <div className={classes.root}>
      {error && <Notice spacingTop={8} text={error} variant="error" />}
      <InputLabel className={classes.radioGroupLabel}>
        {field.label}
        {!isOptional && '*'}
      </InputLabel>

      {oneof.map((choice: string, index) => (
        <FormControlLabel
          control={
            <Radio
              checked={!!value && value === choice}
              data-qa-perm-none-radio
              name={choice}
              onChange={(e) => handleSelectOneOf(e.target.value)}
            />
          }
          key={index}
          label={choice}
          value={choice}
        />
      ))}
    </div>
  );
};
