import { SvgIcon, SvgIconProps } from "@mui/material";

const RangeIcon = (props: SvgIconProps) => {
    return (
        <SvgIcon
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path d="M16.6667 9.5H3.33337V10.5H16.6667V9.5Z" fill="currentColor" />
            <g clipPath="url(#clip0_241_8866)">
                <circle cx="4" cy="10" r="2.5" fill="#E8E8E8" stroke="currentColor" />
                <circle cx="16" cy="10" r="2.5" fill="#E8E8E8" stroke="currentColor" />
            </g>
            <defs>
                <clipPath id="clip0_241_8866">
                    <rect width="20" height="8" fill="white" transform="translate(0 6)" />
                </clipPath>
            </defs>
        </SvgIcon>
    );
};

export default RangeIcon;
