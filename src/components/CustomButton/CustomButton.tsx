import Button from '@mui/material/Button';

interface CustomButtonProps {
  text: string;
  func: () => void;
}

export default function CustomButton({ text, func }: CustomButtonProps) {
  return (
    <Button
      variant="outlined"
      sx={{ borderColor: 'tomato' }}
      onClick={func}
    >
      {text}
    </Button>
  );
}
