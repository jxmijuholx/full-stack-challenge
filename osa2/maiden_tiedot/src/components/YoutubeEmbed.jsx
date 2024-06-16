import React from 'react';

const YouTubeVideo = () => {
  return (
    <div>
        <h1>BOMBOCLAAT</h1>
      <iframe 
        width="560" 
        height="315" 
        src="https://www.youtube.com/embed/RMdcfPIzb2g?si=MvhjhAN3Xj-Cl5na" 
        title="YouTube video player" 
        frameborder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
        referrerpolicy="strict-origin-when-cross-origin" 
        allowfullscreen>
      </iframe>
    </div>
  );
};

export default YouTubeVideo;
