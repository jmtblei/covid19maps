import React from "react";
import { BrowserRouter as Router, Link } from "react-router-dom";
import { 
  Button, 
  Grid, 
  Menu, 
  MenuItem, 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText
} from "@material-ui/core";
import { Help, FilterList, GitHub, LinkedIn, Web } from "@material-ui/icons";

export default function SimpleMenu() {
  //Filter
  const [anchorEl, setAnchorEl] = React.useState(null);

  const toggleClick = event => {
    setAnchorEl(event.currentTarget);
  };
  
  const toggleClose = () => {
    setAnchorEl(null);
  };


  //About dialog
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  
    return (
      <div className="navm">
        <AppBar position="static">
          <Toolbar>
            <Grid
              container
              direction="row"
              justify="space-between"
              alignItems="center"
            >
              <Button 
                aria-controls="simple-menu" 
                aria-haspopup="true" 
                onClick={toggleClick}
                endIcon={<FilterList />}
                style={{color:"white"}}
              >
                Filter by view
              </Button>
              <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={toggleClose}
              >
                <MenuItem onClick={toggleClose} component={Link} to="/">Confirmed Cases (All Time)</MenuItem>
                <MenuItem onClick={toggleClose} component={Link} to="/deaths-all-time">Confirmed Deaths (All Time)</MenuItem>
                <MenuItem onClick={toggleClose} component={Link} to="/recoveries-all-time">Confirmed Recoveries (All Time)</MenuItem>
                <MenuItem onClick={toggleClose} component={Link} to="/confirmed-24h">Confirmed Cases (24H)</MenuItem>
                <MenuItem onClick={toggleClose} component={Link} to="/deaths-24h">Confirmed Deaths (24H)</MenuItem>
              </Menu>
              <Typography variant="h6">COVID-19 MAPS</Typography>
              <div>
                <Button variant="outlined" color="primary" onClick={handleClickOpen}>
                  <Help style={{color:"white"}}/>
                </Button>
                <Dialog
                  open={open}
                  onClose={handleClose}
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
                >
                  <DialogTitle id="alert-dialog-title">{"About"}</DialogTitle>
                  <DialogContent>
                    <DialogContentText>
                      This website uses circular packing (also known as a circular treemap) in conjunction with a heat-map theme to visualize hierarchical organization of data for regions/countries affected by Covid-19. Regions are grouped by continents, and countries are sub-grouped within their respective region. The size and color of each circle is proportional to a specific case value.
                    </DialogContentText>
                    <Typography id="alert-dialog-description">
                        <div className="about-contributor">
                            <h4>Contributors:</h4>
                            <a href="https://github.com/jmtblei" target="_blank" rel="noopener noreferrer" className="icon-link">
                                <IconButton aria-label="github" color="primary" className="icon-color">
                                    <GitHub />
                                </IconButton>    
                            </a>
                            <a href="https://www.linkedin.com/in/jmtblei/" target="_blank" rel="noopener noreferrer" className="icon-link">
                                <IconButton aria-label="github" color="primary" className="icon-color">
                                    <LinkedIn />
                                </IconButton>
                            </a>
                            <a href="https://bensonlei.com/" target="_blank" rel="noopener noreferrer" className="icon-link">
                                <IconButton aria-label="github" color="primary" className="icon-color">
                                    <Web />
                                </IconButton>
                            </a>
                            <br />
                            <p> <b>Benson Lei</b> | Software Engineer
                            </p>
                        </div>
                    </Typography>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleClose} color="primary">
                      Close
                    </Button>
                  </DialogActions>
                </Dialog>
              </div>
            </Grid>
          </Toolbar>
        </AppBar>
      </div>
    );
}
  