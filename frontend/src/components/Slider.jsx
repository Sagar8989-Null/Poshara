import React from "react";
import "../CSS/slider.css";

const Slider = () => {
  return (
    <main className="slider-container">

      {/* 🌸 Top Row (normal direction) */}
      <div
        className="slider"
        style={{
          "--width": "400px",
          "--height": "60px",
          "--quantity": 10,
        }}
      >
        <div className="list">
          <div className="item" style={{ "--position": 1 }}>Poshara की मदद से अब खाना बर्बाद नहीं होता, भूखे पेट भरते हैं! – Sujata Restaurant</div>
          <div className="item" style={{ "--position": 2 }}>Because of Poshara, our children receive fresh meals every evening. – Seva Foundation</div>
          <div className="item" style={{ "--position": 3 }}>Poshara मुळे उरलेलं अन्न आता गरजूंना पोहोचतं, समाधान मिळतं. – आनंदभोजन गृह</div>
          <div className="item" style={{ "--position": 4 }}>Our kitchen waste reduced by 40% after joining Poshara! – Urban Table</div>
          <div className="item" style={{ "--position": 5 }}>अब हर डिलीवरी समय पर और ताज़ा पहुँचती है, धन्यवाद Poshara! – Udaan NGO</div>
          <div className="item" style={{ "--position": 6 }}>Poshara ने समाजाशी जोडणं सोपं केलं आहे. – नंदनवन फूड्स</div>
          <div className="item" style={{ "--position": 7 }}>Simple, fast, and purposeful — Poshara changed how we donate. – Spice Street Café</div>
          <div className="item" style={{ "--position": 8 }}>Poshara के कारण अब रोज़ाना 60 बच्चों को खाना मिलता है। – Annapurna Trust</div>
          <div className="item" style={{ "--position": 9 }}>उरलेलं अन्न वाया न घालवता आता कुणाचं तरी पोट भरतो. – स्वादिष्ट भोजनालय</div>
          <div className="item" style={{ "--position": 10 }}>Poshara bridges kindness with hunger beautifully. – Hope Meals</div>
        </div>
      </div>

      {/* 🌿 Middle Row (reverse direction) */}
      <div
        className="slider"
        reverse="true"
        style={{
          "--width": "400px",
          "--height": "60px",
          "--quantity": 10,
        }}
      >
        <div className="list">
          <div className="item" style={{ "--position": 1 }}>अब खाना फेंकना नहीं पड़ता, हर थाली मुस्कान लेकर जाती है। – Rasoi Junction</div>
          <div className="item" style={{ "--position": 2 }}>Every donation feels like a small act of humanity. – The Green Bowl</div>
          <div className="item" style={{ "--position": 3 }}>Poshara ने आमचं मिशन सोपं आणि सुंदर केलं. – दया संस्थान</div>
          <div className="item" style={{ "--position": 4 }}>Our volunteers love the map system, deliveries are smoother now. – Food4All NGO</div>
          <div className="item" style={{ "--position": 5 }}>Poshara ने हम जैसे रेस्टोरेंट्स को दान करने की नई राह दिखाई। – Delhi Bites</div>
          <div className="item" style={{ "--position": 6 }}>हा अॅप म्हणजे सेवा आणि संवेदनेचं सुंदर मिश्रण आहे. – जीवनदीप संस्था</div>
          <div className="item" style={{ "--position": 7 }}>We’ve reduced food waste and increased smiles. – Café Nirvana</div>
          <div className="item" style={{ "--position": 8 }}>अब कोई भूखा नहीं सोता — यही है असली बदलाव। – Seva Sankalp Foundation</div>
          <div className="item" style={{ "--position": 9 }}>Poshara च्या मदतीने रोज मुलांना ताजं जेवण देऊ शकतो. – जनसेवा फाउंडेशन</div>
          <div className="item" style={{ "--position": 10 }}>An app that connects hearts through food — truly inspiring. – Joy Kitchen</div>
        </div>
      </div>

      {/* 💫 Bottom Row (normal direction again) */}
      <div
        className="slider"
        style={{
          "--width": "400px",
          "--height": "60px",
          "--quantity": 10,
        }}
      >
        <div className="list">
          <div className="item" style={{ "--position": 1 }}>Poshara की वजह से अब जरूरतमंदों तक खाना सही वक्त पर पहुँचता है। – Sahayta NGO</div>
          <div className="item" style={{ "--position": 2 }}>आमच्या रेस्टॉरंटमध्ये उरलेलं अन्न आता दानात जातं, waste नाही! – स्वादिष्ट फूड हाऊस</div>
          <div className="item" style={{ "--position": 3 }}>We love the live map feature — helps track donations easily. – Café Aroma</div>
          <div className="item" style={{ "--position": 4 }}>Poshara ने आमचं नेटवर्क वाढवलं आणि मनाला समाधान दिलं. – स्नेहसेवा संस्था</div>
          <div className="item" style={{ "--position": 5 }}>Real-time updates make food delivery seamless and timely. – Helping Hands NGO</div>
          <div className="item" style={{ "--position": 6 }}>Poshara के कारण अब हमारे रसोईघर में सेवा की खुशबू फैलती है। – Tasty Rasoi</div>
          <div className="item" style={{ "--position": 7 }}>This platform gave purpose to our leftovers — amazing initiative! – The Spice Spoon</div>
          <div className="item" style={{ "--position": 8 }}>Poshara मुळे दान करणे आता सहज सवय झाली आहे. – सुगंध भोजनालय</div>
          <div className="item" style={{ "--position": 9 }}>We’re proud to be part of a system that truly feeds hope. – Nourish Point</div>
          <div className="item" style={{ "--position": 10 }}>हर प्लेट अब किसी की उम्मीद बन जाती है — धन्यवाद Poshara! – Maa Annapurna Kitchen</div>
        </div>
      </div>
    </main>
  );
};

export default Slider;
