import { View, type ViewStyle } from 'react-native';
import { SvgXml } from 'react-native-svg';

interface Props {
  /**
   * Nguồn ảnh SVG
   */
  SvgSrc: any;
  /**
   * Kích thước
   */
  size: number;
  style?: ViewStyle;
  /**
   * Màu
   */
  color?: string;
  height?: number;
  width?: number;
  isSquare?: boolean;
}

function AppSvg(props: Props) {
  const {
    SvgSrc = ``,
    size = 24,
    style = {},
    color = '',
    height,
    width,
    isSquare = true,
  } = props;

  const modifiedColor = SvgSrc.replaceAll(
    'fill="black"',
    'fill="' + color + '"'
  );

  return (
    <View
      style={{
        height: isSquare ? size : height,
        width: isSquare ? size : width,
        justifyContent: 'center',
        alignItems: 'center',
        ...style,
      }}
    >
      {SvgSrc ? (
        <SvgXml xml={modifiedColor} width={size} height={size} />
      ) : (
        <View />
      )}
    </View>
  );
}

export default AppSvg;
