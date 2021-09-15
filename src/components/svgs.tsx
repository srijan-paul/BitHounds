// We have to use SVG props here instead of direct SVGs because the css `fill` and `color` properties don't
// work on SVGs that are loaded via `import` or `require`.
import React from "react";

export function Book(props: { size: string }): JSX.Element {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      width={props.size}
      strokeLinejoin="round"
      className="feather feather-book-open"
    >
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
    </svg>
  );
}

export function Code(props: { size: string }): JSX.Element {
  return (
    <svg width={props.size} viewBox="0 0 19 13" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <title>code [#1115]</title>
      <desc>Created with Sketch.</desc>
      <defs></defs>
      <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g
          id="Dribbble-Light-Preview"
          transform="translate(-180.000000, -3283.000000)"
          fill="currentColor"
        >
          <g id="icons" transform="translate(56.000000, 160.000000)">
            <path
              d="M129.204085,3126.419 C129.587463,3126.032 129.587463,3125.405 129.204085,3125.018 L129.191207,3125.005 C128.807829,3124.618 128.186697,3124.618 127.803319,3125.005 L124.287534,3128.553 C123.904155,3128.94 123.904155,3129.568 124.287534,3129.955 L127.803319,3133.503 C128.186697,3133.89 128.807829,3133.89 129.191207,3133.503 L129.204085,3133.49 C129.587463,3133.103 129.587463,3132.476 129.204085,3132.089 L127.090057,3129.955 C126.706679,3129.568 126.706679,3128.94 127.090057,3128.553 L129.204085,3126.419 Z M142.712466,3128.553 L139.196681,3125.005 C138.814294,3124.618 138.192171,3124.618 137.808793,3125.005 L137.795915,3125.018 C137.412537,3125.405 137.412537,3126.032 137.795915,3126.419 L139.910934,3128.553 C140.294312,3128.94 140.294312,3129.568 139.910934,3129.955 L137.795915,3132.089 C137.412537,3132.476 137.412537,3133.103 137.795915,3133.49 L137.808793,3133.503 C138.192171,3133.89 138.814294,3133.89 139.196681,3133.503 L142.712466,3129.955 C143.095845,3129.568 143.095845,3128.94 142.712466,3128.553 L142.712466,3128.553 Z M136.809359,3124.40817 L131.74698,3135.23866 C131.582981,3135.57915 131.295245,3136 130.924037,3136 L130.904396,3136 C130.182602,3136 129.712209,3135.0197 130.031369,3134.3588 L135.064287,3123.63077 C135.228287,3123.29128 135.836165,3123.02511 135.836165,3123.02511 L135.836165,3123 C136.818198,3123 137.127538,3123.74728 136.809359,3124.40817 L136.809359,3124.40817 Z"
              id="code-[#1115]"
            ></path>
          </g>
        </g>
      </g>
    </svg>
  );
}

export function Dog(props: { size: string }): JSX.Element {
  return (
    <svg
      version="1.1"
      id="Layer_1"
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      width={props.size}
      fill="currentColor"
      viewBox="0 0 400 400"
    >
      <g id="Layer_x0020_1">
        <path
          d="M14.6,264l26.9-61.8L67,173.3l14.8-7.7l3.4-4.4l37-6.7l49.7,0.7l50.4-4.7l7.4-5.1l0,0l1.4-0.9l20.1-12.8
		l4.2-3.2l0,0l7.2-5.5l22.2-36.3l28.9-22.8l1.9-0.3l0,0l4.8-0.8l7.4-17.1l7-2.3c0,0,2.7,3.4,2.7,4.4c0,0.7-0.1,8.7-0.2,13.9l10,4.2
		l13.4,9.4l1.9,3.7l0,0l4.2,8.4l24.2,4.3v0l2,0.4l2,5.4l-0.8,3.5l0,0l-2.5,10.6l-8.7,6.1l-24.9,5.4l-8.7,6l-0.5,5.4l0,0l-1.5,16.7
		L344,161l0,0l-4.3,13.7l-9.4,18.1l-7.4,24.9l-14.1,20.6c-2.5,13.9-7.4,39.9-7.4,39.9l-5.4,35.6l7.4,18.1l12.8,2.7l4,10.1l-14.5,0.7
		l1.1,0.6l0.7,8.7l-6.7,2l-14.7-0.5l0,0l-6.1-0.2l-6-16.1l-6.7-17.5l-2-30.9l-5.4-30.9l-2.9,0.2l0,0l-15.2,1.1l-40.3-3.4l-49.7-8.7
		l-13.4-3.4l-5.2-1l-11.6,23.8l-12.1,14.8l-10.7,12.8L97.9,311l4.7,23.5l7.4,2.7l4,2l-0.7,6.7l-19.5,0.7l-5.4,0.1l-2-14.2l-6.4-34.6
		l-7.1,7l1.3,15.5l4.8,18.5l0,0l0.6,2.3l8.7,5.5l0,0l2,1.3l-2.7,8.7H77.8L62.3,356l-11.4-55.1v-6l6-7.4l2.5-6.5l0,0l2.9-7.6
		l0.7-10.1l-2.4-13.5L56.3,262l-11.4,32.2l-20.1,26.2l-17.5,8c0,0-2-10.7-2-12.8c0-1.6,0-15.6,0-20.9c0-1.2,0-2,0-2L14.6,264
		L14.6,264z"
        />
      </g>
    </svg>
  );
}

export function User(props: { color?: string; size: string }): JSX.Element {
  return (
    <svg
      enableBackground="new 0 0 500 500"
      version="1.1"
      strokeWidth="2"
      viewBox="0 0 500 500"
      xmlns="http://www.w3.org/2000/svg"
      width={props.size}
      fill="currentColor"
    >
      <g>
        <g>
          <path d="M250,291.6c-52.8,0-95.8-43-95.8-95.8s43-95.8,95.8-95.8s95.8,43,95.8,95.8S302.8,291.6,250,291.6z M250,127.3    c-37.7,0-68.4,30.7-68.4,68.4s30.7,68.4,68.4,68.4s68.4-30.7,68.4-68.4S287.7,127.3,250,127.3z" />
        </g>
        <g>
          <path d="M386.9,401.1h-27.4c0-60.4-49.1-109.5-109.5-109.5s-109.5,49.1-109.5,109.5h-27.4c0-75.5,61.4-136.9,136.9-136.9    S386.9,325.6,386.9,401.1z" />
        </g>
      </g>
    </svg>
  );
}

export function SVGSlantTop(props: { color?: string }): JSX.Element {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
      <path
        fill={props.color || "#1a73e8"}
        fillOpacity="1"
        d="M0,256L1440,192L1440,320L0,320Z"
      ></path>
    </svg>
  );
}

export function SVGSlantBottom(props: { color?: string }): JSX.Element {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 220">
      <path fill={props.color || "#1a73e8"} fillOpacity="1" d="M0,160L1440,64L1440,0L0,0Z"></path>
    </svg>
  );
}
