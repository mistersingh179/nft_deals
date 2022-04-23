import React from 'react';
import ReactCanvasConfetti from 'react-canvas-confetti';

const Confetti = (props) => {
  const {fireConfetti, style, className, nextFn} = props
  return (
    <ReactCanvasConfetti
      style={style}
      className={className}
      fire={fireConfetti}
      onDecay={nextFn}
    />
  )
}

export default Confetti