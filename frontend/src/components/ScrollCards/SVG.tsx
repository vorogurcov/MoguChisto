import { FC, SVGProps } from "react";

export const LeftSVG: FC<SVGProps<SVGSVGElement>> = (props) => (
	<svg
		width="65"
		height="66"
		viewBox="0 0 65 66"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		{...props}
	>
		<rect
			x="-0.5"
			y="0.5"
			width="64"
			height="64"
			rx="32"
			transform="matrix(-1 0 0 1 64 0.287109)"
			fill="white"
		/>
		<rect
			x="-0.5"
			y="0.5"
			width="64"
			height="64"
			rx="32"
			transform="matrix(-1 0 0 1 64 0.287109)"
			stroke="#D9D9D9"
		/>
		<g clipPath="url(#clip0_10_701)">
			<path
				d="M32.5 26.7871L33.5575 27.8446L29.3725 32.0371H38.5V33.5371H29.3725L33.565 37.7221L32.5 38.7871L26.5 32.7871L32.5 26.7871Z"
				fill="#292929"
			/>
		</g>
		<defs>
			<clipPath id="clip0_10_701">
				<rect
					width="18"
					height="18"
					fill="white"
					transform="matrix(0 1 1 0 23.5 23.7871)"
				/>
			</clipPath>
		</defs>
	</svg>
);

export const RightSVG: FC<SVGProps<SVGSVGElement>> = (props) => (
	<svg
		width="65"
		height="66"
		viewBox="0 0 65 66"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		{...props}
	>
		<rect x="0.5" y="0.787109" width="64" height="64" rx="32" fill="white" />
		<rect
			x="0.5"
			y="0.787109"
			width="64"
			height="64"
			rx="32"
			stroke="#D9D9D9"
		/>
		<g clipPath="url(#clip0_10_709)">
			<path
				d="M32.5 26.7871L31.4425 27.8446L35.6275 32.0371H26.5V33.5371H35.6275L31.435 37.7221L32.5 38.7871L38.5 32.7871L32.5 26.7871Z"
				fill="#292929"
			/>
		</g>
		<defs>
			<clipPath id="clip0_10_709">
				<rect
					width="18"
					height="18"
					fill="white"
					transform="matrix(0 1 -1 0 41.5 23.7871)"
				/>
			</clipPath>
		</defs>
	</svg>
);
