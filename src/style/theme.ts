import { Dimensions, PixelRatio } from "react-native";

const { width, height } = Dimensions.get('window');

export function getFontSizeByWindowWidth(fontSize: number | string) {
    fontSize = parseInt(fontSize.toString(), 10);
    const baseWidth = 320; // width of smallest iPhone
    return PixelRatio.roundToNearestPixel(fontSize * (width / baseWidth));
}

export function getFontSizeByWindowHeight(fontSize: number | string) {
    fontSize = parseInt(fontSize.toString(), 10);
    const baseHeight = 568; // width of smallest iPhone
    return height > 800
        ? PixelRatio.roundToNearestPixel(fontSize * (800 / baseHeight))
        : PixelRatio.roundToNearestPixel(fontSize * (height / baseHeight));
}


export const gpsh = getFontSizeByWindowHeight
export const gpsw = getFontSizeByWindowWidth