import React, {useRef, useState} from "react";
import { DraggableCore } from "react-draggable";
import debounce from "lodash.debounce";

import classNames from "classnames/bind";
import style from "./ResizePanel.module.css";
let cx = classNames.bind(style);

const NORTH='n';
const SOUTH='s';
const EAST='e';
const WEST='w';

const getDomSize = (domEl, isHorizontal) => domEl.getBoundingClientRect()[isHorizontal ? 'width' : 'height'];

export default ({
  direction,
  containerClass,
  style,
  handleClass,
  borderClass,
  children,
}) => {
  const contentRef = useRef(null);
  const wrapperRef = useRef(null);

  const isHorizontal = [WEST, EAST].includes(direction);
  const isBeforeContent = [NORTH, WEST].includes(direction);


  const [size, setSize] = useState(getDomSize(contentRef.current, isHorizontal));

  const handleDrag = (e, ui) => {
    const factor = isBeforeContent ? 1 : -1;
    const delta = isHorizontal ? ui.deltaX : ui.deltaY;

    setSize(Math.max(10, size - delta * factor));
  };

  const handleStop = e => console.log('done!', e);

  const handle = (
    <DraggableCore key="handle" onDrag={handleDrag} onStop={handleStop}>
      <div className={resizeBarClasses}>
        <div className={handleClasses}>
          <span />
        </div>
      </div>
    </DraggableCore>
  );

  const content = (
    <div
      key="content"
      ref={contentRef}
      className={`resize-content ${contentClassName}`}
      style={contentStyle}
    >
      {children}
    </div>
  );

  return (
    <div
      ref={wrapperRef}
      className={`resize-container ${containerClass || ''} ${isHorizontal ? 'is-horizontal' : 'is-vertical'}`}
      style={containerStyle}
    >
      {isBeforeContent && handle}
      {content}
      {!isBeforeContent && handle}
    </div>
  );
}