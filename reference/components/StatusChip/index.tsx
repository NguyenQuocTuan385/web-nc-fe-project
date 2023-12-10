import { Chip, ChipProps } from '@mui/material';
import { EStatus } from 'models/general';
import { memo } from 'react';

interface StatusChipProps extends ChipProps {
  status: number
}

const StatusChip = memo((props: StatusChipProps) => {
  const { status, ...rest } = props;
  const getLabel = () => {
    switch (status) {
      case EStatus.Active:
        return 'Active';
      case EStatus.Inactive:
        return 'Inactive';
      case EStatus.Coming_Soon:
        return 'Coming soon';
    }
  }

  const getColor = (): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" => {
    switch (status) {
      case EStatus.Active:
        return 'success';
      case EStatus.Inactive:
        return 'error';
      case EStatus.Coming_Soon:
        return 'warning';
    }
  }

  return (
    <Chip 
      label={getLabel()} 
      color={getColor()}
      variant="outlined"
      {...rest}
    />
  )
})


export default StatusChip;