import * as icons from 'lucide-react-native/icons';

interface IconProps {
    name: keyof typeof icons;
    color?: string;
    size?: number;
}

const Icon = ({ name, color, size }: IconProps) => {
    const LucideIcon = icons[name] || icons['Info'];

    return <LucideIcon color={color} size={size} />;
};

export default Icon;