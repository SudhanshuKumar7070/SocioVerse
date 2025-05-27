import React from 'react';
import { TailSpin} from 'react-loader-spinner';

const SpinnerWithText = ({ data = "Loading...", designClass =""}) => {
  return (
    <div className={designClass}>
      <TailSpin
        height="64"
        width="64"
        color="white"

        ariaLabel={data}
        
      />
    </div>
  );
};

export default SpinnerWithText;

