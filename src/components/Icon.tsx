import { LucideProps } from 'lucide-react-native';
import * as icons from 'lucide-react-native/icons';

interface IconProps extends LucideProps {
    name: keyof typeof icons;
    color?: string;
    size?: number;
}

const Icon = ({ name, color, size, ...rest }: IconProps) => {
    const LucideIcon = icons[name] || icons['Info'];

    return <LucideIcon color={color} size={size} {...rest} />;
};

export default Icon;