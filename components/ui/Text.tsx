import type React from 'react';
import { Text as RNText, type TextProps as RNTextProps } from 'react-native';
import { twMerge } from 'tailwind-merge';

export interface TextProps extends RNTextProps {
  /**
   * Text variant style
   * @default 'body'
   */
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'body-sm' | 'label';

  /**
   * Text weight
   * @default 'regular'
   */
  weight?: 'light' | 'regular' | 'medium' | 'semibold' | 'bold' | 'extrabold';

  /**
   * Text color
   * @default Uses the variant's default color
   */
  color?: string;

  /**
   * Center text
   * @default false
   */
  center?: boolean;
}

/**
 * Typography component for consistent text styling
 */
const Text: React.FC<TextProps> = ({
  variant = 'body',
  weight = 'regular',
  color,
  center = false,
  children,
  className,
  style,
  ...props
}) => {
  // Base variant styles with sizes and line heights
  const variantClasses = {
    h1: 'text-4xl leading-snug',
    h2: 'text-3xl leading-snug',
    h3: 'text-2xl leading-snug',
    h4: 'text-xl leading-snug',
    body: 'text-base leading-normal',
    'body-sm': 'text-sm leading-normal',
    label: 'text-base leading-tight',
  };

  // Default variant colors if no color is specified
  const defaultColors = {
    h1: 'text-black dark:text-white',
    h2: 'text-black dark:text-white',
    h3: 'text-black dark:text-white',
    h4: 'text-black dark:text-white',
    body: 'text-black dark:text-white',
    'body-sm': 'text-black dark:text-white',
    label: 'text-black dark:text-white',
  };

  // Text alignment
  const alignmentClass = center ? 'text-center' : '';

  // Custom color class if provided
  const colorClass = color || defaultColors[variant];

  const fontFamily = (weight: string) => {
    switch (weight) {
      case 'regular':
        return 'DynaPuffRegular';
      case 'medium':
        return 'DynaPuffMedium';
      case 'semibold':
        return 'DynaPuffSemiBold';
      case 'bold':
        return 'DynaPuffBold';
      default:
        return 'DynaPuffRegular';
    }
  };

  // Combine all classes
  const textClass = twMerge(variantClasses[variant], colorClass, alignmentClass);

  return (
    <RNText {...props} className={twMerge(textClass, className)} style={[{ fontFamily: fontFamily(weight) }, style]}>
      {children}
    </RNText>
  );
};

export default Text;
