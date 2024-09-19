import * as React from 'react';
import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import NoteIcon from '@mui/icons-material/Note';
import SickIcon from '@mui/icons-material/Sick';
import HailIcon from '@mui/icons-material/Hail';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InsightsIcon from '@mui/icons-material/Insights';
import ScienceIcon from '@mui/icons-material/Science';
import { Col, Container, Image, NavDropdown, Row } from 'react-bootstrap';
import styles from './SideBar.module.scss';
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import { avatarEmpty } from '../../utils/Avatar';
import { DoorOpen } from 'react-bootstrap-icons';

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  backgroundColor: '#099',
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    backgroundColor: '#099',
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

export default function SideBar() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar className="pe-0">
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: 'none' }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Container className={`d-flex align-items-center justify-content-end`}>
            <NavDropdown
              title={
                <div className={`d-flex justify-content-end`}>
                  <Image
                    src={avatarEmpty}
                    alt="Аватар пользователя"
                    className={`border border-3 align-self-center ${styles.avatar}`}
                  />
                </div>
              }
              id="basic-nav-dropdown"
            >
              <Container>
                <Row className="border-bottom m-1 text-center">
                  <Col>
                    <span>Агеев Денис Константинович</span>
                    <br />
                    <span className="text-muted">den@mail.ru</span>
                  </Col>
                </Row>
                <Row>
                  <NavDropdown.Item>
                    <span
                      className="nav-link d-flex align-items-center"
                      //onClick={handleLogout}
                    >
                      <DoorOpen color="gray" size={20} className="me-2" />
                      Выйти
                    </span>
                  </NavDropdown.Item>
                </Row>
              </Container>
            </NavDropdown>
          </Container>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <Col sm="8" className="d-flex align-items-center justify-content-center ">
            <Image src={require('./logo.png')} alt="Логотип ИС" className={`${styles.logo}`} />
            <p className="px-1">ПроВЕТ</p>
          </Col>
          <Col sm="4" className="d-flex align-items-center justify-content-end">
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>
          </Col>
        </DrawerHeader>
        <Divider />
        <List>
          <ListItem disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
              }}
              href="/#statistic"
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                }}
              >
                <InsightsIcon />
              </ListItemIcon>
              <ListItemText primary="Статистика" sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>
        </List>

        <Divider />
        {/* Лаборатория */}
        {open ? (
          <Accordion>
            <AccordionSummary
              expandIcon={<NoteIcon />}
              aria-controls="panel-content"
              id="panel-header"
            >
              <Typography>Справочники</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List>
                <ListItem disablePadding sx={{ display: 'block' }}>
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? 'initial' : 'center',
                      px: 2.5,
                    }}
                    href="/#owners"
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : 'auto',
                        justifyContent: 'center',
                      }}
                    >
                      <HailIcon />
                    </ListItemIcon>
                    <ListItemText primary="Владельцы" sx={{ opacity: open ? 1 : 0 }} />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding sx={{ display: 'block' }}>
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? 'initial' : 'center',
                      px: 2.5,
                    }}
                    href="/#patients"
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : 'auto',
                        justifyContent: 'center',
                      }}
                    >
                      <SickIcon />
                    </ListItemIcon>
                    <ListItemText primary="Пациенты" sx={{ opacity: open ? 1 : 0 }} />
                  </ListItemButton>
                </ListItem>
              </List>
            </AccordionDetails>
          </Accordion>
        ) : (
          <AccordionSummary
            expandIcon={<NoteIcon />}
            aria-controls="panel-content"
            id="panel-header"
            sx={{ justifyContent: 'center' }}
          />
        )}
        {open ? (
          <Accordion>
            <AccordionSummary
              expandIcon={<ScienceIcon />}
              aria-controls="panel-content"
              id="panel-header"
            >
              <Typography>Лаборатория</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List>
                <ListItem disablePadding sx={{ display: 'block' }}>
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? 'initial' : 'center',
                      px: 2.5,
                    }}
                    href="/#blood-test"
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : 'auto',
                        justifyContent: 'center',
                      }}
                    >
                      <HailIcon />
                    </ListItemIcon>
                    <ListItemText primary="Исследование крови" sx={{ opacity: open ? 1 : 0 }} />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding sx={{ display: 'block' }}>
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? 'initial' : 'center',
                      px: 2.5,
                    }}
                    href="/#urine-test"
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : 'auto',
                        justifyContent: 'center',
                      }}
                    >
                      <SickIcon />
                    </ListItemIcon>
                    <ListItemText primary="Исследование мочи" sx={{ opacity: open ? 1 : 0 }} />
                  </ListItemButton>
                </ListItem>
              </List>
            </AccordionDetails>
          </Accordion>
        ) : (
          <AccordionSummary
            expandIcon={<ScienceIcon />}
            aria-controls="panel-content"
            id="panel-header"
            sx={{ justifyContent: 'center' }}
          />
        )}
      </Drawer>
    </Box>
  );
}
