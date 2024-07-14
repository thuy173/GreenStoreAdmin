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
    fetch(`http://localhost:8086/api/order/notification?page=${pages}&size=3`)
      .then((response) => response.json())
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
    fetchNotifications(1);
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

          <ol>
            {notifications.map((order, index) => (
              <li key={index} style={{ fontWeight: order.isNew ? 'bold' : 'normal' }}>
                {order.fullName} - {order.orderCode}
              </li>
            ))}
          </ol>
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
