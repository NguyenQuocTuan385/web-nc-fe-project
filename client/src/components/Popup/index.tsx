import classes from "./styles.module.scss"

const Popup = ({properties}: any) => {
  return (
  <div className={classes.popup}>
    <div style={{ fontWeight: "bold", fontSize: "13px" }}>{properties.ads_form_name}</div>
    <div style={{ fontSize: "13px" }}>{properties.address}</div>
    <div style={{ fontSize: "13px" }}>{properties.location_type_name}</div>
    {properties.planning ? <div style={{ fontWeight: "bold", fontSize: "14px" }}>ĐÃ QUY HOẠCH</div> : <div style={{ fontWeight: "bold", fontSize: "14px" }}>CHƯA QUY HOẠCH</div>}
  </div>
  )
}
  
export default Popup;