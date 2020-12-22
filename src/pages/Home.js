import React, { useEffect, useState } from 'react';
import Footer from '../components/static/Footer';
import Postcard from '../components/Postcard';
import { Grid, GridList, GridListTile, makeStyles } from '@material-ui/core';
import {
  getAllEvents,
  getParticipations,
  getUserInterestedEvents,
  getUserParticipationEvents,
  setError,
  setNotification,
} from '../features/eventSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import AddEvent from '../components/AddEvent';
import { useSnackbar } from 'notistack';
import NotificationHandler from '../components/static/NotificationHandler';

function Home() {
  const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
      overflow: 'hidden',
      backgroundColor: 'rgba(220, 220, 220, 0.54)',
    },
    gridList: {
      maxWidth: 745,
    },
    icon: {
      color: 'rgba(255, 255, 255, 0.54)',
    },
  }));

  const classes = useStyles();
  const dispatch = useDispatch();
  const events = useSelector((state) => state.event.events);
  const user = useSelector((state) => state.user.user);
  const hist = useHistory();
  const notification = useSelector((state) => state.event.notification);
  const error = useSelector((state) => state.event.error);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (!user) hist.push('/Landing');
    else if (events.length === 0) dispatch(getAllEvents({ token: user.token }));
    else if (!('userParticipate' in events[0]))
      dispatch(getUserParticipationEvents({ token: user.token }));
    else if (!('userInterested' in events[0]))
      dispatch(getUserInterestedEvents({ token: user.token }));

    // if (notification) {
    //   enqueueSnackbar(notification, {
    //     anchorOrigin: {
    //       vertical: 'bottom',
    //       horizontal: 'left',
    //     },
    //     variant: 'success',
    //   });
    // }
    // if (error) {
    //   enqueueSnackbar(error, {
    //     anchorOrigin: {
    //       vertical: 'bottom',
    //       horizontal: 'left',
    //     },
    //     variant: 'error',
    //   });
    // }
  }, [events, user, notification]);

  let eventsView = events
    ? events.map((event) => (
        <GridListTile
          key={event.id}
          cols={2}
          style={{ height: 'auto', marginTop: 30 }}
        >
          <Postcard
            key={event.id}
            id={event.id}
            title={event.title}
            date={event.date}
            detail={event.detail}
            description={event.description}
            nbParticipents={event.nbParticipents}
            nbInterested={event.nbInterested}
            userParticipate={event.userParticipate}
            userInterested={event.userInterested}
          />
        </GridListTile>
      ))
    : [];

  return (
    <div className={classes.root}>
      <GridList cellHeight={180} className={classes.gridList}>
        <GridListTile cols={2} style={{ height: 'auto', marginTop: 30 }}>
          <AddEvent />
        </GridListTile>
        {eventsView}
      </GridList>
      <Footer />

      <NotificationHandler
        error={error}
        notification={notification}
        setError={setError}
        setNotification={setNotification}
      />
    </div>
  );
}

export default Home;
