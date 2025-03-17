import { Switch } from 'react-native';

export default function WSwitch({
  onChange,
  value = false,
  color,
  size = 1,
}: {
  onChange: (value: boolean) => void;
  value: boolean;
  color: string;
  size?: number;
}) {
  return (
    <Switch
      trackColor={{ false: '#EFEFF0', true: color ?? '#287CF0' }}
      ios_backgroundColor="#EFEFF0"
      style={{ transform: [{ scaleX: size }, { scaleY: size }] }}
      onValueChange={onChange}
      value={value}
    />
  );
}
