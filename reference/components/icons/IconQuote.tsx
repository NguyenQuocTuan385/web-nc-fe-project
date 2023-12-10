import { SvgIcon, SvgIconProps } from "@mui/material";

const Quote = (props: SvgIconProps) => {
    return (
        <SvgIcon
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <g mask="url(#mask0_241_7443)">
                <path d="M19.6666 14.9997H24.3333V10.3329H19.6666V14.9997ZM7.66656 14.9997H12.3333V10.3329H7.66656V14.9997ZM20.9359 22.3329L23.4872 16.9996H17.6666V8.33301H26.3332V16.9996L23.7948 22.3329H20.9359ZM8.93589 22.3329L11.4872 16.9996H5.66663V8.33301H14.3332V16.9996L11.7948 22.3329H8.93589Z" fill="currentColor" />
            </g>
        </SvgIcon>
    );
};

export default Quote;
