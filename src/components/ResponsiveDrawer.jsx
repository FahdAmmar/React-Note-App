import * as React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Notes as AllNotesIcon,
  CheckCircle as CheckedIcon,
  RadioButtonUnchecked as NotCheckedIcon,
} from '@mui/icons-material';

import CardNote from './CardNote.jsx';
import { useContext, useEffect } from 'react';
import MainContext from '../ContextFolder/MainContext.jsx';
import { v4 as uuidv4 } from 'uuid';



const drawerWidth = 150;

function ResponsiveDrawer(props) {

  const { notes, setNotes } = useContext(MainContext);
  const [search, setSearch] = React.useState("");
  const [filter, setFilter] = React.useState("all")

  const compleated=notes.filter((note)=> note.complated)
  const notCompleated=notes.filter((note)=> !note.complated)

  let allNotes=notes
  if(filter==="completed"){
    allNotes=compleated
  }else if(filter==="notcompleted"){
    allNotes=notCompleated
  }
console.log(`fliter is ${filter}`)
  console.log(allNotes)




  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };


  //new dirawer content
  const [inputval, setInputval] = React.useState({ title: "", content: "" });
  const [open, setOpen] = React.useState(false);


  const handleClose = () => {
    setOpen(false);
  };

  const handleInputNewNote = (e) => {
    e.preventDefault();
    const newNote = {
      id: uuidv4(),
      title: inputval.title,
      content: inputval.content,
      complated: false,
      time: new Date().toLocaleString()
    };
    const updatedNotes = [...notes, newNote];
    setNotes(updatedNotes);
    setInputval({ title: "", content: "" });
    handleClose();
    setOpen(false)
    localStorage.setItem("notes", JSON.stringify(updatedNotes))
  }


  // function handleClickEnter(e) {
  //   if (e.key === "Enter") {
  //      setOpen(!open)
  //   }
  // }


  // useEffect(() => { document.addEventListener('keyup', handleClickEnter) });



  const handleClickOpen = () => {
    setOpen(true);


  };



  useEffect(() => {
    const saved = localStorage.getItem("notes");
    if (saved) {
      setNotes(JSON.parse(saved))
    }
  }, [])


  
  const menuItems = [
    { text: 'All notes', value: 'all', icon: <AllNotesIcon /> },
    { text: 'Checked', value: 'completed', icon: <CheckedIcon /> },
    { text: 'Not Checked', value: 'notcompleted', icon: <NotCheckedIcon /> },
  ];


  const drawer = (
    <div className='bg-[#313a41] h-full text-white relative'>
      <div style={{ position: "absolute", top: "0", width: "100%", marginLeft: "4px", marginTop: "30px", height: "50px" }}>
        <h1>Notes</h1>
        <button onClick={handleClickOpen} style={{ position: "absolute", top: "10px", right: "10px", padding: "5px 10px", borderRadius: "5px", backgroundColor: "#202833", color: "white", border: "none", cursor: "pointer" }}>+</button>
      </div>

      <Toolbar />
      <Divider className='mb-5' sx={{ marginTop: "30px" }} />



      <List className='text-[0.5rem]' value={filter} onChange={(e)=>setFilter(e.target.value)}>
        {menuItems.map((item) => (
          <ListItem key={item.value} disablePadding>
            <ListItemButton
              selected={filter === item.value}
              onClick={() => setFilter(item.value)}
              value={item.value}
            >
              <ListItemIcon>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>


    </div>
  );

  // Remove this const when copying and pasting into your project.
  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <div className='top'>
      <Button variant="outlined" onClick={handleClickOpen}>
        Open form dialog
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>New note</DialogTitle>
        <DialogContent>
          <DialogContentText>
            write your note here
          </DialogContentText>
          <form id="subscription-form">
            <TextField
              autoFocus
              required
              margin="dense"
              id="name"
              name="text"
              label="Add note title"
              type="text"
              fullWidth
              variant="standard"
              value={inputval.title}
              onChange={(e) => setInputval({ ...inputval, title: e.target.value })}
            />
            <TextField
              autoFocus
              required
              margin="dense"
              id="name"
              name="text"
              label="Add note content"
              type="text"
              fullWidth
              variant="standard"
              value={inputval.content}
              onChange={(e) => setInputval({ ...inputval, content: e.target.value })}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" form="subscription-form" onClick={handleInputNewNote}>
            Add
          </Button>
        </DialogActions>
      </Dialog>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar className='bg-[#313a41] width-full text-white relative navbartop'
          position="fixed"
          sx={{
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            ml: { sm: `${drawerWidth}px` },
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                type="text"
                placeholder="Search..."
                class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-white-500 focus:border-white-500 focus:outline-none shadow-sm placeholder-gray-400 transition-all duration-200"
              />


            </Typography>
          </Toolbar>
        </AppBar>
        <Box
          component="nav"
          sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
          aria-label="mailbox folders"
        >
          {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
          <Drawer
            container={container}
            variant="temporary"
            open={mobileOpen}
            onTransitionEnd={handleDrawerTransitionEnd}
            onClose={handleDrawerClose}
            sx={{
              display: { xs: 'block', sm: 'none' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
            slotProps={{
              root: {
                keepMounted: true, // Better open performance on mobile.
              },
            }}
          >
            {drawer}
          </Drawer>
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', sm: 'block' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>
        <Toolbar />
        <Box className="cardnotes  grid grid-cols-1sm:grid-cols-2  md:grid-cols-3 gap-4 items-center justify-content-between  mt-10 position-relative" ent="main"
          sx={{ flexGrow: 1, p: 1, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
        >
          {/* Main content goes here */}

          {allNotes.filter((note) => note.title.toLowerCase().includes(search.toLowerCase())).map((note) => (
            <CardNote key={note.id} note={note} />
          ))}

        </Box>
      </Box>
    </div>

  );
}

ResponsiveDrawer.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * Remove this when copying and pasting into your project.
   */
  window: PropTypes.func,
};

export default ResponsiveDrawer;
