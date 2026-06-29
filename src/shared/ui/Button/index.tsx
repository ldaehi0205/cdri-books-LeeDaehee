import { cva, type VariantProps } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';
import { ButtonHTMLAttributes } from 'react';
import { BUTTON } from './constants';

const buttonVariants = cva(
  'inline-flex items-center justify-center w-full rounded-[8px] text-base font-medium cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        [BUTTON.variant.primary]: 'bg-blue-500 text-white hover:bg-[#3a6fd4]',
        [BUTTON.variant.secondary]:
          'bg-cool-gray-50 text-[#6D7582] hover:bg-[#e5e8ec]',
        [BUTTON.variant.outline]:
          'border border-[#8D94A0] bg-white text-[#8D94A0] hover:bg-[#f5f6f7]',
      },
      size: {
        [BUTTON.size.sm]: 'h-8 px-3 text-[14px]',
        [BUTTON.size.md]: 'h-10 px-4',
        [BUTTON.size.lg]: 'h-12 px-6',
      },
    },
    defaultVariants: {
      variant: BUTTON.variant.primary,
      size: BUTTON.size.md,
    },
  },
);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    className?: string;
  };

const Button = ({ variant, size, className, ...props }: ButtonProps) => {
  return (
    <button
      className={twMerge(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
};

export default Button;
