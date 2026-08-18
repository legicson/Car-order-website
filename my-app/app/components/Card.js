import React from 'react';
import PropTypes from 'prop-types';

const Card = ({ item, onCardClick, onDelete, styles = {} }) => {
  const {
    userName,
    date,
    additionalInfo,
    containerStyle,
    contentStyle,
    buttonStyle,
    textStyle,
    deleteButtonStyle
  } = styles;

  const containerClassName = `card ${containerStyle || ''}`;
  const contentClassName = `card-body ${contentStyle || ''}`;
  const textClassName = `card-text ${textStyle || ''}`;
  const buttonClassName = `btn btn-danger ${deleteButtonStyle || ''}`;

  const handleCardClick = () => {
    if (onCardClick) {
      onCardClick(item);
    }
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation(); // Prevent triggering the card's onClick
    if (onDelete) {
      onDelete(item);
    }
  };

  return (
    <div 
      className={containerClassName} 
      onClick={handleCardClick}
      style={{ cursor: 'pointer', ...containerStyle }}
    >
      <div className={contentClassName}>
        <div className="d-flex justify-content-between align-items-center">
          <div className={textClassName}>
            <h5 className="card-title">{userName}</h5>
            <p className="card-text text-muted">{date}</p>
            {additionalInfo && <p className="card-text">{additionalInfo}</p>}
          </div>
          <button 
            className={buttonClassName}
            onClick={handleDeleteClick}
            style={deleteButtonStyle}
            aria-label="Delete item"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

Card.propTypes = {
  item: PropTypes.object.isRequired,
  onCardClick: PropTypes.func,
  onDelete: PropTypes.func,
  styles: PropTypes.shape({
    containerStyle: PropTypes.object,
    contentStyle: PropTypes.object,
    buttonStyle: PropTypes.object,
    textStyle: PropTypes.object,
    deleteButtonStyle: PropTypes.object,
    userName: PropTypes.string,
    date: PropTypes.string,
    additionalInfo: PropTypes.string,
  }),
};

export default Card;
