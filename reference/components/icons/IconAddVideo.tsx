import { SvgIcon, SvgIconProps } from "@mui/material";

const AddVideo = ({ ...props }: SvgIconProps) => {
    return (
        <SvgIcon width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <g clipPath="url(#clip0_378_14009)">
                <path
                    d="M1.99996 3.99984H14V7.33317H15.3333V3.99984C15.3333 3.2665 14.7333 2.6665 14 2.6665H1.99996C1.26663 2.6665 0.666626 3.2665 0.666626 3.99984V11.9998C0.666626 12.7332 1.26663 13.3332 1.99996 13.3332H7.99996V11.9998H1.99996V3.99984Z"
                    fill="currenColor"
                />
                <path
                    d="M10 7.99967L6 5.33301V10.6663L10 7.99967Z"
                    fill="currenColor"
                />
                <path
                    d="M12 13.3332C12 13.6998 12.3 13.9998 12.6667 13.9998C13.0333 13.9998 13.3333 13.6998 13.3333 13.3332V11.9998H14.6667C15.0333 11.9998 15.3333 11.6998 15.3333 11.3332C15.3333 10.9665 15.0333 10.6665 14.6667 10.6665H13.3333V9.33317C13.3333 8.9665 13.0333 8.6665 12.6667 8.6665C12.3 8.6665 12 8.9665 12 9.33317V10.6665H10.6667C10.3 10.6665 10 10.9665 10 11.3332C10 11.6998 10.3 11.9998 10.6667 11.9998H12V13.3332Z"
                    fill="currenColor"
                />
            </g>
            <defs>
                <clipPath id="clip0_378_14009">
                    <rect width="16" height="16" fill="white" />
                </clipPath>
            </defs>
        </SvgIcon>
    )
}

export default AddVideo;