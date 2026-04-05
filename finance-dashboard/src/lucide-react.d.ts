declare module 'lucide-react' {
	import * as React from 'react';

	export interface LucideProps extends React.SVGProps<SVGSVGElement> {
		size?: string | number;
		color?: string;
		strokeWidth?: string | number;
	}

	export type LucideIcon = React.ForwardRefExoticComponent<
		LucideProps & React.RefAttributes<SVGSVGElement>
	>;

	export const Pencil: LucideIcon;
	export const Wallet: LucideIcon;
	export const ArrowUpCircle: LucideIcon;
	export const ArrowDownCircle: LucideIcon;
}
