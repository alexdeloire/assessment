import React from "react";

// This component is used to display the details of a post

const PostDetails = ({ currentPost }) => {
  return (
    <div>
      <h4>Post</h4>

      <div className="row">
        <div className="col-md-6">
          <div>
            <label>
              <strong>Name:</strong>
            </label>{" "}
            {currentPost.title}
          </div>
        </div>

        <div className="col-md-6">
          <div>
            <label>
              <strong>Author:</strong>
            </label>{" "}
            {currentPost.author.name}
            <img
              className="ml-2 profile-img-card"
              src={currentPost.author.avatar}
              alt="avatar"
            />
          </div>
        </div>
      </div>

      <div>
        <label>
          <strong>Summary:</strong>
        </label>{" "}
        {currentPost.summary}
      </div>

      <div>
        <label>
          <strong>Publish Date:</strong>
        </label>{" "}
        {currentPost.publishDate}
      </div>

      <div>
        <label>
          <strong>Categories:</strong>
        </label>{" "}
        {currentPost.categories.map((category) => {
          return (
            <span className="badge bg-secondary me-1 mr-1" key={category.id}>
              {category.name}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default PostDetails;
