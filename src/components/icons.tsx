import { icons, type LucideProps } from 'lucide-react';

type IconProps = LucideProps & {
  name: keyof typeof icons;
};

export const Icon = ({ name, ...props }: IconProps) => {
  const LucideIcon = icons[name];

  if (!LucideIcon) {
    // You can render a default icon or null
    return null;
  }

  return <LucideIcon {...props} />;
};
