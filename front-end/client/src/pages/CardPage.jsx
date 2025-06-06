import React from "react";
import "../Card.css";

const Card = ({src,title,km,price}) => {
  return (
    <div className="card">
        <img src={src} alt="" />
        <div className="card__info">
            <h2>{title}</h2>
            <h4>{km}</h4>
            <h3>{price}</h3>
       </div>     
    </div>
  )
}

export default Card