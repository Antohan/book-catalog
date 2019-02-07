import * as React from 'react';

import './EventItem.css';

const eventItem = (props) => {
  return (
    <li key={props.eventId} className="events__list-item">
      <div>
        <h1>{props.title}</h1>
        <h2>${props.price} - {new Date(props.date).toLocaleDateString('ru-Ru')}</h2>
      </div>
      <div>
        {props.userId === props.creatorId
          ? <p>You the owner this Event</p>
          : <button
            className="btn"
            onClick={props.onDetail.bind(this, props.eventId)}
            >View Details</button>}
      </div>
    </li>
  );
}

export default eventItem;