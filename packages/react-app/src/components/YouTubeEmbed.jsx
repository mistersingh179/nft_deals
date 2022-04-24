import React from "react";
import PropTypes from "prop-types";

const YouTubeEmbed = ({ embedId }) => (
  <div className="video-responsive">
    <iframe
      src={`https://www.youtube.com/embed/${embedId}`}
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      title="NFT Deals Explainer Video"
    />
  </div>
);

YouTubeEmbed.propTypes = {
  embedId: PropTypes.string.isRequired
};

export default YouTubeEmbed;