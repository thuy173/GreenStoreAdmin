import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Badge from '@mui/material/Badge';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Popover from '@mui/material/Popover';
import IconButton from '@mui/material/IconButton';
import ListSubheader from '@mui/material/ListSubheader';
import { Avatar, Typography, ListItemText, ListItemAvatar, ListItemButton } from '@mui/material';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

export default function NotificationsPopover() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
    markNotificationsAsRead();
  };

  const handleClose = () => {
    setOpen(null);
  };

  const fetchNotifications = useCallback((pages) => {
    fetch(`http://localhost:8086/api/notification?page=${pages}&size=3`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.text(); // Retrieve response as text
      })
      .then((text) => {
        if (!text) {
          return { content: [] }; // Return empty content if response is empty
        }
        return JSON.parse(text); // Parse the text as JSON
      })
      .then((data) => {
        if (data.content.length === 0) {
          setHasMore(false);
        } else {
          const updatedNotifications = data.content.map((notification) => ({
            ...notification,
            isNew: false,
          }));
          setNotifications((prevNotifications) => [...prevNotifications, ...updatedNotifications]);
        }
      })
      .catch((error) => {
        console.error('Error fetching notifications:', error);
      });
  }, []);

  const markNotificationsAsRead = () => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) => ({
        ...notification,
        isNew: false,
      }))
    );
  };

  useEffect(() => {
    fetchNotifications(0);
    const socket = new SockJS('http://localhost:8086/ws');
    const stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    stompClient.onConnect = () => {
      console.log('Connected to WebSocket');
      stompClient.subscribe('/topic/orders', (message) => {
        console.log('Received message:', message);
        const newOrder = JSON.parse(message.body);
        newOrder.isNew = true;
        setNotifications((prevNotifications) => [newOrder, ...prevNotifications]);
      });

      stompClient.subscribe('/topic/blogs', (message) => {
        console.log('Received message:', message);
        const newBlog = JSON.parse(message.body);
        newBlog.isNew = true;
        setNotifications((prevNotifications) => [newBlog, ...prevNotifications]);
      });
    };

    stompClient.activate();
    return () => {
      stompClient.deactivate();
    };
  }, [fetchNotifications]);

  const handleMoreClick = () => {
    if (hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchNotifications(nextPage);
    }
  };

  return (
    <>
      <IconButton color={open ? 'primary' : 'default'} onClick={handleOpen}>
        <Badge badgeContent={notifications.filter((n) => n.isNew).length} color="error">
          <Iconify width={24} icon="solar:bell-bing-bold-duotone" />
        </Badge>
      </IconButton>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            mt: 0.5,
            ml: 0.25,
            width: 360,
          },
        }}
      >
        <Scrollbar sx={{ height: { xs: 140, sm: 'auto' } }}>
          <List
            disablePadding
            subheader={
              <ListSubheader disableSticky sx={{ py: 1, px: 2.5, typography: 'overline' }}>
                Notification
              </ListSubheader>
            }
          />
          <Divider sx={{ borderStyle: 'dashed' }} />

          {notifications.map((notification, index) => (
            <ListItemButton
              key={index}
              style={{ fontWeight: notification.isNew ? 'bold' : 'normal' }}
              sx={{
                py: 1.5,
                px: 2.5,
                mt: '1px',
                ...(notification.isUnRead && {
                  bgcolor: 'action.selected',
                }),
              }}
            >
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: 'background.neutral' }}>{notification.thumbnail}</Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={notification.fullName}
                secondary={
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 0.5,
                      display: 'flex',
                      alignItems: 'center',
                      color: 'text.disabled',
                    }}
                  >
                    <Iconify icon="eva:clock-outline" sx={{ mr: 0.5, width: 16, height: 16 }} />
                    {/* {fToNow(notification.createdAt)} */}
                  </Typography>
                }
              />
            </ListItemButton>
          ))}
        </Scrollbar>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Box sx={{ p: 1 }}>
          {hasMore && (
            <Button fullWidth disableRipple onClick={handleMoreClick}>
              More
            </Button>
          )}
        </Box>
      </Popover>
    </>
  );
}
