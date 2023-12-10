import { Check } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import Images from "config/images";

const ColorlibStepIconRoot = styled('div')<{ ownerState: { active?: boolean, completed?: boolean } }>(
  ({ theme, ownerState }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#ccc',
    zIndex: 1,
    color: '#fff',
    width: 32,
    height: 32,
    display: 'flex',
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    ...(ownerState.active && {
      background: '#1F61A9',
    }),
    ...(ownerState.completed && {
      background: '#1F61A9',
    }),
    '& .QontoStepIcon': {
      background: "#1F61A9",
      height: 32,
      width: 32,
      borderRadius: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    '& .QontoStepIcon-completedIcon': {
      color: 'white',
      zIndex: 1,
      fontSize: 18,
      
    },
    '& .QontoStepIcon-activeIcon': {
      background: "#1F61A9",
      height: 32,
      width: 32,
      borderRadius: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    '& .QontoStepIcon-circle': {
      background: "#C4C4C4",
      height: 32,
      width: 32,
      borderRadius: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    
  }));

function ColorlibStepIcon(props) {
  const { active, completed, className } = props;

  const icons = {
    1: <Check className="QontoStepIcon-completedIcon" />,
    2: <img src={Images.icUploadPack} alt='' />,
    3: <img src={Images.icAdditionalBrandList} alt='' />,
    4: <img src={Images.icAdditionalAttributes} alt='' />,
    5: <img src={Images.icAdditionalBrandList} alt='' />,
  };

  return (
    // <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
    //   {icons[String(props.icon)]}
    // </ColorlibStepIconRoot>
    <ColorlibStepIconRoot ownerState={{ active, completed }} className={className}>
      {completed ? (
        <div className="QontoStepIcon">
          <Check className="QontoStepIcon-completedIcon" />
        </div>
      ) : active ? (
        <div className="QontoStepIcon-activeIcon">{icons[String(props.icon)]}</div>
      ) : <div className="QontoStepIcon-circle">{icons[String(props.icon)]}</div>}
    </ColorlibStepIconRoot>
  );
}

export default ColorlibStepIcon;