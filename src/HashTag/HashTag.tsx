import {
  Text,
  type TextStyle,
  type ViewStyle,
  TouchableOpacity,
} from 'react-native';

interface Props {
  title: string;
  textStyles?: TextStyle;
  styles?: ViewStyle;
}

const HashTag = (props: Props) => {
  const { title, textStyles, styles } = props;
  return (
    <TouchableOpacity
      style={{
        height: 32,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 12,
        margin: 4,
        alignSelf: 'flex-start',
        backgroundColor: '#F4F4F5',
        borderRadius: 100,
        ...styles,
      }}
    >
      <Text
        style={{
          fontSize: 14,
          color: '#161C24',
          ...textStyles,
        }}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default HashTag;
