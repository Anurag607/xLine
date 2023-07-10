import React from "react";

// Function Component for Loader...
const Loader: React.FC = () => {
  return (
    <div className="loader">
      {new Array(10).fill(0).map((_, i) => {
        return <div className="circle" key={i} />;
      })}
    </div>
  );
};

export default Loader;
