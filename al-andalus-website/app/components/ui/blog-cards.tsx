import React from "react";

interface BlogCardProps {
  title: string;
  date: string;
  description: string;
  imageUrl?: string | null;
}

const BlogCard = ({ title, date, description, imageUrl }: BlogCardProps) => {
  return (
    <div className="blog-card">
      <div 
        className="blog-card__thumbnail"
        style={imageUrl ? { backgroundImage: `url(${imageUrl})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}
      />
      <div className="blog-card__content">
        <div className="blog-card__header">
          <div className="blog-card__title">
            {title}
          </div>
          <span className="blog-card__line"></span>
          <div className="blog-card__date">
            {date}
          </div>
        </div>
        <div className="blog-card__description">
          {description}
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
