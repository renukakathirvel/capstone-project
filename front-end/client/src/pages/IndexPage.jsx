import React from "react";
// import Banner from "../../components/Banner/Banner";
import Card from "./CardPage";
import "../Card.css";


const Index = () => {
  return (
    <div>
    <div className="home__section">
      <Card 
      title="Kodaikanal, India"
      src="https://a0.muscache.com/im/pictures/06239b01-7b4d-4003-ba77-44d6983795da.jpg?im_w=720"
      km="74 kilometers away"
      price="₹19,971 for 5 nights"
      />
      <Card 
      title="Rajakkad, India"
      src="https://a0.muscache.com/im/pictures/hosting/Hosting-1315303299475673812/original/080d0edd-3076-4fc9-b5e5-7f499e4125a1.jpeg?im_w=720"
      km="112 kilometers away"
      price="₹28,244 for 5 nights"
      />
      <Card 
      title="Kodaikanal, India"
      src="https://a0.muscache.com/im/pictures/7ef7f41b-62e2-43c1-b68f-8cd23e954167.jpg?im_w=720"
      km="77 kilometers away"
      price="₹143,218 for 5 nights"
      />
    </div>

    <div className="home__section">
      <Card 
      title="Nedumkandam, India"
      src="https://a0.muscache.com/im/pictures/6575abcf-874b-4e19-948f-9f30da55d115.jpg?im_w=720"
      km="110 kilometers away"
      price="₹7,412 for 5 nights"
      />
      <Card 
      title="Township, India"
      src="https://a0.muscache.com/im/pictures/b90dd38f-f1e3-49f3-92f5-834bc0823d53.jpg?im_w=720"
      km="140 kilometers away"
      price="₹8,533 for 5 nights"
      />
      <Card 
      title="Vilpatti, India"
      src="https://a0.muscache.com/im/pictures/miso/Hosting-1284579835956333641/original/5c454c30-acb1-48e1-933c-59180cade378.jpeg?im_w=720"
      km="79 kilometers away"
      price="₹46,104 for 5 nights"
      />

    </div>
    </div>
  );
};

export default Index;