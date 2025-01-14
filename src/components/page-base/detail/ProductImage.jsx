import React from "react";

const ProductImage = () => {
  return (
    <div className="w-full">
      <div className="p-4">
        <img
          src="https://th.bing.com/th?id=OIP.4akau9Zyzq-ioaE0S_YVrwHaHa&w=380&h=380&c=8&rs=1&qlt=90&o=6&pid=3.1&rm=2"
          alt="Main Product"
        />
      </div>
      <div className="mt-2 flex space-x-4">
        <div>
          <img
            src="https://th.bing.com/th?id=OIP.4akau9Zyzq-ioaE0S_YVrwHaHa&w=90&h=90&c=8&rs=1&qlt=90&o=6&pid=3.1&rm=2"
            alt="Thumbnail 1"
          />
        </div>
        <div>
          <img
            src="https://th.bing.com/th?id=OIP.4akau9Zyzq-ioaE0S_YVrwHaHa&w=90&h=90&c=8&rs=1&qlt=90&o=6&pid=3.1&rm=2"
            alt="Thumbnail 2"
          />
        </div>
        <div>
          <img
            src="https://th.bing.com/th?id=OIP.4akau9Zyzq-ioaE0S_YVrwHaHa&w=90&h=90&c=8&rs=1&qlt=90&o=6&pid=3.1&rm=2"
            alt="Thumbnail 3"
          />
        </div>
        <div>
          <img
            src="https://th.bing.com/th?id=OIP.4akau9Zyzq-ioaE0S_YVrwHaHa&w=90&h=90&c=8&rs=1&qlt=90&o=6&pid=3.1&rm=2"
            alt="Thumbnail 4"
          />
        </div>
      </div>
    </div>
  );
};

export default ProductImage;
