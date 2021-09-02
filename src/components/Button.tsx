import "./css/Button.css";

export default function Button(props: {
  children: any;
  onClick?: (_: any) => any;
  style?: object;
}) {
  return (
    <button className="btn" onClick={props.onClick} style={props.style || {}}>
      {props.children}
    </button>
  );
}
